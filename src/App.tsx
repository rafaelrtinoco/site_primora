import { MotionConfig } from 'framer-motion';
import Home from './pages/Home';

function App() {
  /* reducedMotion="user" faz o Framer descartar automaticamente as animações
     de transform quando o sistema pede menos movimento, preservando a
     opacidade. Cobre os reveals de todas as seções sem repetir condicional
     em cada componente. */
  return (
    <MotionConfig reducedMotion="user">
      <Home />
    </MotionConfig>
  );
}

export default App;
