import { API_BASE_URL } from '../config';

const brandBase = `${API_BASE_URL}/api/v1/brands`;

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { error?: string; details?: unknown };
    const detailMsg =
      typeof err.details === 'object' && err.details !== null && 'message' in err.details
        ? String((err.details as { message?: string }).message)
        : null;
    throw new Error(err.error || detailMsg || 'Request failed');
  }
  return data;
}

export async function brandRegister(fd: FormData) {
  return parseJson(
    await fetch(`${brandBase}/register`, {
      method: 'POST',
      credentials: 'include',
      body: fd,
    }),
  );
}

export async function brandLogin(body: { email: string; password: string }) {
  return parseJson(
    await fetch(`${brandBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    }),
  );
}

export async function brandLogout() {
  return parseJson(
    await fetch(`${brandBase}/logout`, {
      method: 'POST',
      credentials: 'include',
    }),
  );
}

export async function brandMe() {
  return parseJson(
    await fetch(`${brandBase}/me`, {
      credentials: 'include',
    }),
  );
}

export async function brandDeleteAccount() {
  return parseJson(
    await fetch(`${brandBase}/me`, {
      method: 'DELETE',
      credentials: 'include',
    }),
  );
}

export async function listBrandPromotions() {
  return parseJson(
    await fetch(`${brandBase}/promotions`, {
      credentials: 'include',
    }),
  );
}

export async function createBrandPromotion(fd: FormData) {
  return parseJson(
    await fetch(`${brandBase}/promotions`, {
      method: 'POST',
      credentials: 'include',
      body: fd,
    }),
  );
}

export async function updateBrandPromotion(id: number, fd: FormData) {
  return parseJson(
    await fetch(`${brandBase}/promotions/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: fd,
    }),
  );
}

export async function cancelBrandPromotion(id: number) {
  return parseJson(
    await fetch(`${brandBase}/promotions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }),
  );
}

export async function fetchApprovedSponsors() {
  const res = await fetch(`${API_BASE_URL}/api/v1/public/promotions/approved`);
  const data = await res.json();
  if (!res.ok) return { items: [] as { companyName: string; logoUrl: string | null }[] };
  return data as { items: { companyName: string; logoUrl: string | null }[] };
}
