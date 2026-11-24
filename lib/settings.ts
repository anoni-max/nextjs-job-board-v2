import { prisma } from "@/lib/prisma";

export async function getSetting(key: string, fallback: string): Promise<string> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getDuplicateThresholds(): Promise<{ confirm: number; pending: number }> {
  const confirmRaw = await getSetting("duplicate.confirmThreshold", "90");
  const pendingRaw = await getSetting("duplicate.pendingThreshold", "70");

  const confirm = parseInt(confirmRaw, 10);
  const pending = parseInt(pendingRaw, 10);

  return {
    confirm: isNaN(confirm) ? 90 : confirm,
    pending: isNaN(pending) ? 70 : pending,
  };
}
