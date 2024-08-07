import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    const token = localStorage.getItem("token") || "";
    const router = inject(Router);

    if (token !== "") {
      return true;
    } else {
      const url = router.createUrlTree(["/login"]); // Redirige al login si no hay token
      return url;
    }
  } else {
    // Si no estamos en el navegador, simplemente redirigimos al login.
    const router = inject(Router);
    return router.createUrlTree(["/login"]);
  }
};

