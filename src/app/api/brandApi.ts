import { apiUrl } from '../config';

const brandBase = apiUrl('/api/v1/brands');

function errorMessageFromApiBody(data: unknown): string | null {
  const err = data as { error?: string; details?: unknown };
  if (err.error) return err.error;
  const details = err.details;
  if (typeof details === 'object' && details !== null) {
    if ('message' in details && typeof (details as { message?: string }).message === 'string') {
      return (details as { message: string }).message;
    }
    if ('issues' in details && Array.isArray((details as { issues?: unknown[] }).issues)) {
      const issues = (details as { issues: { message?: string }[] }).issues;
      const text = issues.map((i) => i.message).filter(Boolean).join('. ');
      if (text) return text;
    }
  }
  return null;
}

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(errorMessageFromApiBody(data) || 'Request failed');
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

export type BrandPromotionPayload = {
  promotionCode: string;
  description?: string;
  message?: string;
  sportModality: string;
  eligibleWinnerScope: string;
  validity_start_date?: string;
  validity_end_date?: string;
};

export async function createBrandPromotion(body: BrandPromotionPayload) {
  return parseJson(
    await fetch(`${brandBase}/promotions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    }),
  );
}

export async function updateBrandPromotion(id: number, body: BrandPromotionPayload) {
  return parseJson(
    await fetch(`${brandBase}/promotions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
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
  const res = await fetch(apiUrl('/api/v1/public/promotions/approved'));
  const data = await res.json();
  if (!res.ok) return { items: [] as { companyName: string; logoUrl: string | null }[] };
  return data as { items: { companyName: string; logoUrl: string | null }[] };
}
