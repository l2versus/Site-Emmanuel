import { Queue, type QueueOptions } from "bullmq";
import { redis } from "./redis";

export const QUEUES = {
  whatsappInbound: "whatsapp.inbound",
} as const;

const baseOptions: QueueOptions = {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { age: 24 * 3600, count: 1000 },
    removeOnFail: { age: 7 * 24 * 3600 },
  },
};

export const whatsappInboundQueue = new Queue(QUEUES.whatsappInbound, baseOptions);

export type WhatsappInboundJob = {
  evolutionMessageId: string;
  fromNumber: string;
  pushName: string | null;
  text: string | null;
  type: string;
  timestamp: number;
  raw: unknown;
};
