import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { animate, type AnimationPlaybackControls } from 'framer-motion';
import { DUR, EASE } from '../../lib/motion';
import type { ToolGlyph } from '../../lib/brandGlyphs';

/**
 * Montagem imperativa da cena Three.js da seção Ferramentas.
 *
 * Vanilla Three, sem react-three-fiber: uma dependência a menos e controle
 * direto do loop de render, que é justamente o que precisa parar fora da
 * viewport, com a aba oculta e em `prefers-reduced-motion` (ver
 * CenaFerramentas.tsx, que decide quando chamar `pausar`/`retomar`).
 */

export type FerramentaCena = {
  nome: string;
  glifo: ToolGlyph;
};

type Callbacks = {
  /** Disparado quando o visitante clica um tile no canvas. */
  onSelecionar: (indice: number) => void;
};

export type ControleCena = {
  /** Gira o anel para trazer o tile ao centro. Chamado quando o React muda o índice ativo. */
  selecionar: (indice: number) => void;
  pausar: () => void;
  retomar: () => void;
  dispose: () => void;
};

/* ---- Geometria e paleta dos tiles -----------------------------------------
   Face carbon-900, bisel moss-700: os mesmos dois tons que separam a moldura
   de IconFrame do fundo da seção no resto do site. Cor de marca aparece só
   no glifo, nunca no tile. */
const TILE_LADO = 0.95;
const TILE_RAIO = TILE_LADO * (14 / 64); // proporção de --radius-frame (14px sobre moldura de 64px)
const TILE_PROFUNDIDADE = 0.155;
const TILE_BISEL_ESPESSURA = 0.027;
const TILE_BISEL_TAMANHO = 0.021;
const TILE_GLIFO_ALVO = TILE_LADO * 0.5; // maior lado do glifo dentro da face
const ANEL_RAIO = 2.1;
const ANEL_INCLINACAO = THREE.MathUtils.degToRad(12);
const VELOCIDADE_IDLE = (Math.PI * 2) / 40; // uma volta a cada ~40s, ritmo do .hero-symbol (48s)
const ACID_400 = 0xdbeb17;
const CARBON_900 = 0x171915;
const MOSS_700 = 0x2e3823;

function formaRetanguloArredondado(lado: number, raio: number): THREE.Shape {
  const s = new THREE.Shape();
  const m = -lado / 2;
  const M = lado / 2;
  s.moveTo(m, m + raio);
  s.lineTo(m, M - raio);
  s.quadraticCurveTo(m, M, m + raio, M);
  s.lineTo(M - raio, M);
  s.quadraticCurveTo(M, M, M, M - raio);
  s.lineTo(M, m + raio);
  s.quadraticCurveTo(M, m, M - raio, m);
  s.lineTo(m + raio, m);
  s.quadraticCurveTo(m, m, m, m + raio);
  return s;
}

function criarGeometriaTile(): THREE.ExtrudeGeometry {
  const forma = formaRetanguloArredondado(TILE_LADO, TILE_RAIO);
  const geometria = new THREE.ExtrudeGeometry(forma, {
    depth: TILE_PROFUNDIDADE,
    bevelEnabled: true,
    bevelThickness: TILE_BISEL_ESPESSURA,
    bevelSize: TILE_BISEL_TAMANHO,
    bevelSegments: 3,
    curveSegments: 8,
  });
  // ExtrudeGeometry por padrão vai de z=0 (fundo) a z=depth (frente), não
  // centralizado. Centralizar aqui é o que permite ao glifo (montado em
  // criarCenaFerramentas) se posicionar relativo à face da frente sem
  // precisar conhecer os detalhes internos desta geometria.
  geometria.translate(0, 0, -TILE_PROFUNDIDADE / 2);
  return geometria;
}

/** Luminância relativa aproximada, 0 (preto) a 1 (branco). */
function luminancia(cor: THREE.Color): number {
  return 0.2126 * cor.r + 0.7152 * cor.g + 0.0722 * cor.b;
}

/**
 * Extrude o path do glifo (simple-icons ou fallback Phosphor) e centraliza
 * na origem, com Y invertido: SVG cresce para baixo, Three para cima.
 */
function criarGeometriaGlifo(glifo: ToolGlyph): THREE.ExtrudeGeometry {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${glifo.viewBox} ${glifo.viewBox}"><path d="${glifo.path}"/></svg>`;
  const resultado = new SVGLoader().parse(svg);
  const shapes = resultado.paths.flatMap((p) => p.toShapes());

  const profundidade = glifo.viewBox * 0.05;
  const geometria = new THREE.ExtrudeGeometry(shapes, { depth: profundidade, bevelEnabled: false });
  geometria.computeBoundingBox();
  const caixa = geometria.boundingBox!;
  const largura = caixa.max.x - caixa.min.x;
  const altura = caixa.max.y - caixa.min.y;
  const cx = (caixa.min.x + caixa.max.x) / 2;
  const cy = (caixa.min.y + caixa.max.y) / 2;

  geometria.translate(-cx, -cy, -profundidade / 2);

  const escala = TILE_GLIFO_ALVO / Math.max(largura, altura, 1e-6);
  geometria.scale(escala, escala, escala);

  return geometria;
}

function criarMaterialGlifo(glifo: ToolGlyph): THREE.MeshStandardMaterial {
  const cor = new THREE.Color(glifo.hex ? `#${glifo.hex}` : ACID_400);

  // Piso de luminância: uma marca cujo guia usa preto (ex.: CapCut) some
  // sobre o carbon-950 da seção. O próprio guia dessas marcas recomenda a
  // versão branca para fundo escuro, então é o que fazemos aqui.
  if (luminancia(cor) < 0.15) {
    cor.setHex(0xffffff);
  }

  return new THREE.MeshStandardMaterial({
    color: cor,
    emissive: cor,
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.05,
  });
}

type TilePivot = {
  grupo: THREE.Group;
  anguloBase: number;
  materialGlifo: THREE.MeshStandardMaterial;
  malhaTile: THREE.Mesh;
};

/** Menor caminho angular de `atual` até o representante de `alvoPrincipal` mod 2π. */
function anguloMaisProximo(atual: number, alvoPrincipal: number): number {
  const volta = Math.PI * 2;
  const atualMod = ((atual % volta) + volta) % volta;
  const alvoMod = ((alvoPrincipal % volta) + volta) % volta;
  let delta = alvoMod - atualMod;
  if (delta > Math.PI) delta -= volta;
  if (delta < -Math.PI) delta += volta;
  return atual + delta;
}

export function criarCenaFerramentas(
  container: HTMLDivElement,
  ferramentas: FerramentaCena[],
  { onSelecionar }: Callbacks,
): ControleCena {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.set(0, 0.6, 7.4);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearAlpha(0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Tone mapping desloca o hex: um azul do Google Ads que não bate com
  // #4285F4 é pior que nenhum logo.
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(MOSS_700, 0.9));

  const luzPrincipal = new THREE.DirectionalLight(0xffffff, 1.6);
  luzPrincipal.position.set(-4, 5, 4);
  scene.add(luzPrincipal);

  // Luz de contorno limão: o acento da marca volta a ser luz, não tinta.
  const luzContorno = new THREE.DirectionalLight(ACID_400, 0.5);
  luzContorno.position.set(3, -1, -4);
  scene.add(luzContorno);

  const tiltGroup = new THREE.Group();
  tiltGroup.rotation.x = ANEL_INCLINACAO;
  scene.add(tiltGroup);

  const ringGroup = new THREE.Group();
  tiltGroup.add(ringGroup);

  const geometriaTile = criarGeometriaTile();
  const materialFace = new THREE.MeshStandardMaterial({ color: CARBON_900, roughness: 0.55, metalness: 0.08 });
  const materialBisel = new THREE.MeshStandardMaterial({ color: MOSS_700, roughness: 0.6, metalness: 0.05 });

  const n = ferramentas.length;
  const pivots: TilePivot[] = ferramentas.map((ferramenta, i) => {
    const anguloBase = (i / n) * Math.PI * 2;

    const grupo = new THREE.Group();
    grupo.position.set(Math.sin(anguloBase) * ANEL_RAIO, 0, Math.cos(anguloBase) * ANEL_RAIO);
    grupo.userData.indice = i;

    const malhaTile = new THREE.Mesh(geometriaTile, [materialFace, materialBisel]);
    malhaTile.userData.indice = i;
    grupo.add(malhaTile);

    const materialGlifoAtual = criarMaterialGlifo(ferramenta.glifo);
    const malhaGlifo = new THREE.Mesh(criarGeometriaGlifo(ferramenta.glifo), materialGlifoAtual);
    // A face da frente do tile (já centralizado em Z) fica em
    // +TILE_PROFUNDIDADE/2, e o bisel avança mais TILE_BISEL_ESPESSURA além
    // dela. Sem esse cálculo o glifo fica enterrado dentro do volume sólido
    // do tile e nunca aparece, que era exatamente o bug anterior.
    malhaGlifo.position.z = TILE_PROFUNDIDADE / 2 + TILE_BISEL_ESPESSURA + 0.02;
    // Desfaz o Y-para-baixo do SVG no Mesh, não na geometria: um espelho
    // aplicado direto na BufferGeometry só move os vértices, sem tocar nas
    // normais, e a malha acaba iluminada como se estivesse de costas pra luz
    // (fica preta). No Object3D, o Three detecta a matriz de determinante
    // negativo e inverte o teste de winding sozinho, então a luz acerta.
    malhaGlifo.scale.y = -1;
    grupo.add(malhaGlifo);

    ringGroup.add(grupo);

    return { grupo, anguloBase, materialGlifo: materialGlifoAtual, malhaTile };
  });

  const tilesRaycast = pivots.map((p) => p.malhaTile);

  /* ---- Estado de rotação e foco ------------------------------------------
     `rotacaoAtual` nunca é lida a partir de ringGroup.rotation.y: é a fonte
     da verdade, escrita pelo avanço ocioso OU por uma animação de foco, nunca
     pelas duas ao mesmo tempo. */
  let rotacaoAtual = 0;
  let indiceAtivo = 0;
  let animandoFoco = false;
  let controleAnimacao: AnimationPlaybackControls | null = null;
  let pausado = false;

  function selecionar(indice: number) {
    if (indice < 0 || indice >= n) return;
    indiceAtivo = indice;
    const alvo = anguloMaisProximo(rotacaoAtual, -pivots[indice].anguloBase);
    controleAnimacao?.stop();
    animandoFoco = true;
    controleAnimacao = animate(rotacaoAtual, alvo, {
      duration: DUR.slow,
      ease: EASE,
      onUpdate: (v) => {
        rotacaoAtual = v;
      },
      onComplete: () => {
        animandoFoco = false;
      },
    });
  }

  // Tile 0 centralizado desde o primeiro frame, sem animação de entrada.
  rotacaoAtual = -pivots[0].anguloBase;

  /* ---- Interação: raycaster contra os tiles ------------------------------ */
  const raycaster = new THREE.Raycaster();
  const ponteiro = new THREE.Vector2();
  let indiceHover: number | null = null;

  function atualizarPonteiro(evento: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    ponteiro.x = ((evento.clientX - rect.left) / rect.width) * 2 - 1;
    ponteiro.y = -((evento.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function testarIntersecao(): number | null {
    raycaster.setFromCamera(ponteiro, camera);
    const hits = raycaster.intersectObjects(tilesRaycast, false);
    if (hits.length === 0) return null;
    return (hits[0].object.userData.indice as number) ?? null;
  }

  function aoMoverPonteiro(evento: PointerEvent) {
    atualizarPonteiro(evento);
    indiceHover = testarIntersecao();
    renderer.domElement.style.cursor = indiceHover !== null ? 'pointer' : 'default';
  }

  function aoClicar(evento: PointerEvent) {
    atualizarPonteiro(evento);
    const indice = testarIntersecao();
    if (indice !== null) onSelecionar(indice);
  }

  function aoSairPonteiro() {
    indiceHover = null;
    renderer.domElement.style.cursor = 'default';
  }

  renderer.domElement.addEventListener('pointermove', aoMoverPonteiro);
  renderer.domElement.addEventListener('click', aoClicar);
  renderer.domElement.addEventListener('pointerleave', aoSairPonteiro);

  /* ---- Redimensionamento --------------------------------------------------
     ResizeObserver no host, não window.resize: a seção reflui em qualquer
     mudança de largura do container, inclusive fora de um resize da janela
     (ex.: DevTools abrindo do lado). */
  function redimensionar() {
    const largura = container.clientWidth;
    const altura = container.clientHeight;
    if (largura === 0 || altura === 0) return;
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
    renderer.setSize(largura, altura);
  }

  const resizeObserver = new ResizeObserver(redimensionar);
  resizeObserver.observe(container);
  redimensionar();

  /* ---- Loop de render ------------------------------------------------------ */
  let quadroAnterior = performance.now();
  let frameId = 0;

  function quadro(agora: number) {
    frameId = requestAnimationFrame(quadro);
    const dt = Math.min((agora - quadroAnterior) / 1000, 0.05);
    quadroAnterior = agora;

    if (!animandoFoco) {
      rotacaoAtual += VELOCIDADE_IDLE * dt;
    }
    ringGroup.rotation.y = rotacaoAtual;

    for (const pivot of pivots) {
      // Billboard amortecido: o yaw local cancela o giro do anel, então o
      // tile mantém a face voltada pra câmera onde quer que esteja na órbita
      // e nunca aparece de perfil.
      const alvoYaw = -rotacaoAtual;
      pivot.grupo.rotation.y = THREE.MathUtils.damp(pivot.grupo.rotation.y, alvoYaw, 6, dt);

      const ativo = pivot.grupo.userData.indice === indiceAtivo;
      const emHover = pivot.grupo.userData.indice === indiceHover;
      const alvoEscala = ativo ? 1.14 : emHover ? 1.05 : 1;
      const alvoAltura = ativo ? 0.2 : 0;
      const alvoEmissivo = ativo ? 0.65 : emHover ? 0.5 : 0.35;

      const escala = THREE.MathUtils.damp(pivot.grupo.scale.x, alvoEscala, 6, dt);
      pivot.grupo.scale.setScalar(escala);
      pivot.grupo.position.y = THREE.MathUtils.damp(pivot.grupo.position.y, alvoAltura, 6, dt);
      pivot.materialGlifo.emissiveIntensity = THREE.MathUtils.damp(
        pivot.materialGlifo.emissiveIntensity,
        alvoEmissivo,
        6,
        dt,
      );
    }

    renderer.render(scene, camera);
  }

  frameId = requestAnimationFrame(quadro);

  function pausar() {
    if (pausado) return;
    pausado = true;
    cancelAnimationFrame(frameId);
  }

  function retomar() {
    if (!pausado) return;
    pausado = false;
    quadroAnterior = performance.now();
    frameId = requestAnimationFrame(quadro);
  }

  function dispose() {
    cancelAnimationFrame(frameId);
    controleAnimacao?.stop();
    resizeObserver.disconnect();
    renderer.domElement.removeEventListener('pointermove', aoMoverPonteiro);
    renderer.domElement.removeEventListener('click', aoClicar);
    renderer.domElement.removeEventListener('pointerleave', aoSairPonteiro);

    geometriaTile.dispose();
    materialFace.dispose();
    materialBisel.dispose();
    for (const pivot of pivots) {
      pivot.materialGlifo.dispose();
      for (const filho of pivot.grupo.children) {
        if (filho instanceof THREE.Mesh && filho.geometry !== geometriaTile) {
          filho.geometry.dispose();
        }
      }
    }

    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return { selecionar, pausar, retomar, dispose };
}
