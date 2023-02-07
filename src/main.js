/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
import { Login } from './pages/login.js';
// eslint-disable-next-line import/no-cycle, import/no-unresolved
import { Register } from './pages/Register.js';
import { timeLine } from './pages/timeLine.js';
import { profile } from './pages/profile.js';

const root = document.getElementById('root');
const routes = {
  '/': Login,
  '/login': Login,
  '/register': Register,
  '/timeLine': timeLine,
  '/profile': profile,
};

// eslint-disable-next-line max-len
// El primer argumento es un objeto vacío, el segundo es el nuevo nombre de ruta y el tercero es la URL completa.
export const next = (pathname) => { // Esta funcion permite cambiar la ruta (URL) actual y reemplazar el contenido HTML en la página sin recargar la página.
  window.history.pushState({}, pathname, window.location.origin + pathname);
  root.innerHTML = '';
  root.appendChild(routes[pathname]());
};

export const onNavigate = (pathname) => {
  window.history.pushState( // cambia la URL actual en el navegador sin recargar la página.
    {},
    pathname,
    window.location.origin + pathname,
  );
  root.removeChild(root.firstChild); // elimina el primer hijo del elemento con el ID "root".
  root.appendChild(routes[pathname]());// agrega un nuevo contenido HTML al elemento "root" usando la función asociada
};
const component = routes[window.location.pathname];// asigna un componente específico a la constante  basada en la ruta actual del navegador.

window.onpopstate = () => { // se activa cada vez que el usuario navega hacia atrás o adelante en el historial del navegador
  root.removeChild(root.firstChild);
  root.append(component());// agrega el componente actual al elemento "root" ejecutando la función correspondiente.
};

root.appendChild(component());
