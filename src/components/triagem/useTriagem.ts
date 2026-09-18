import { useState } from 'react';
import { site } from '../../content/site';
import { montarLinkWhatsApp, abrirWhatsApp } from '../../lib/whatsapp';

type UsarTriagemProps = {
  /** Chamado depois que o link do WhatsApp já foi aberto (ou tentado). */
  onEnviar: (linkWhatsApp: string, popupBloqueado: boolean) => void;
};

/**
 * Estado e regras da triagem, compartilhados pelas duas interfaces que a
 * usam: o bot em lista de botões embutido na CTA (BotTriagem.tsx) e o chat
 * flutuante da Ceci (ceci/CeciChat.tsx). As perguntas são as mesmas
 * (`site.triagem.perguntas`) e a mensagem final segue o mesmo formato
 * `*Campo:*` nas duas, então elas nunca divergem no que chega no WhatsApp.
 */
export function useTriagem({ onEnviar }: UsarTriagemProps) {
  const perguntas = site.triagem.perguntas;
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const ultimoPasso = passo === perguntas.length;

  function responder(rotulo: string) {
    setRespostas((anteriores) => {
      const novas = [...anteriores];
      novas[passo] = rotulo;
      return novas;
    });
    setPasso((p) => p + 1);
  }

  function voltar() {
    setPasso((p) => Math.max(0, p - 1));
  }

  /**
   * Honeypot preenchido ou WhatsApp não configurado cancelam o envio.
   * Devolve se a mensagem foi mesmo enviada, para quem chama decidir o que
   * fazer com o formulário (limpar campos, marcar nome como enviado etc.).
   */
  function enviar(nome: string, honeypot: string): boolean {
    if (honeypot) return false;

    const linhas = [
      'Olá! Vim pelo site da Praxis Digital e fiz a triagem rápida.',
      '',
      `*Nome:* ${nome}`,
      ...perguntas.map(
        (pergunta, i) => `*${pergunta.rotuloMensagem}:* ${respostas[i] ?? ''}`,
      ),
    ];

    const href = montarLinkWhatsApp(linhas.join('\n'));
    if (!href) return false;

    const popupFoiBloqueado = abrirWhatsApp(href);
    onEnviar(href, popupFoiBloqueado);
    return true;
  }

  return { perguntas, passo, respostas, ultimoPasso, responder, voltar, enviar };
}
