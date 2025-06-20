let globalNavigate: ((path: string) => void) | null = null;

export function setGlobalNavigate(n: (path: string) => void) {
  globalNavigate = n;
}

export function handleHttpError(response : Response) {
    if (response.status === 403) {
      globalNavigate?.("/forbidden");
    } else if (response.status === 401) {
      globalNavigate?.("/unauthorized");
    } else if (response.status === 429) {
      globalNavigate?.("/toomanyrequests")
    }
}