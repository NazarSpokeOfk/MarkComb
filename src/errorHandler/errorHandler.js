let globalNavigate = null

export function setGlobalNavigate (n) {
    globalNavigate = n
}

export function handleHttpError(response) {
    if (response.status === 403) {
      globalNavigate?.("/forbidden");
    } else if (response.status === 401) {
      globalNavigate?.("/unauthorized");
    }
}