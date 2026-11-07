export interface ApiOk<T> {
  ok: true;
  data: T;
  meta: { genereLe: string };
}

export interface ApiErreur {
  ok: false;
  erreur: { code: string; message: string; status: number };
}