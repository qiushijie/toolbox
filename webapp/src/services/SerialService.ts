import network from "./network";

export async function serialIsOpen(): Promise<boolean> {
  const res = await network.get('/serialInfo');
  return res.data.data;
}

export interface OpenOptions {
  name: string;
  baud: number;
}

export async function openSerial(options: OpenOptions) {
  const res = await network.post('/openSerial', options);
  return res.data.success;
}

export async function closeSerial() {
  const res = await network.get('/closeSerial');
  return res.data.success;
}