/**
 * Local SMTP sink for development and tests. It accepts any message and stores
 * it on disk instead of delivering it, so you can exercise the whole email flow
 * without a real mail server:
 *
 *   npm run dev:smtp        (listens on 127.0.0.1:2525, writes to .data/mail)
 *   SMTP_HOST=127.0.0.1 SMTP_PORT=2525 SMTP_SECURE=false npm run dev
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { simpleParser, type ParsedMail } from "mailparser";
import { SMTPServer } from "smtp-server";

export type CapturedMail = { raw: Buffer; parsed: ParsedMail; envelopeTo: string[]; envelopeFrom: string | false };

export type SmtpSink = {
  port: number;
  messages: CapturedMail[];
  /** When set, the next matching recipients are rejected (to exercise failed-email handling). */
  failWith: { code: number; message: string } | null;
  close: () => Promise<void>;
};

export async function startSmtpSink(options: { port?: number; dir?: string } = {}): Promise<SmtpSink> {
  const messages: CapturedMail[] = [];
  const dir = options.dir;
  if (dir) mkdirSync(dir, { recursive: true });

  const sink: SmtpSink = { port: options.port ?? 2525, messages, failWith: null, close: async () => undefined };

  const server = new SMTPServer({
    authOptional: true,
    disabledCommands: ["STARTTLS"],
    logger: false,
    onAuth(_auth, _session, callback) {
      callback(null, { user: "sink" });
    },
    onData(stream, session, callback) {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("end", async () => {
        if (sink.failWith) {
          const error = Object.assign(new Error(sink.failWith.message), { responseCode: sink.failWith.code });
          callback(error);
          return;
        }
        const raw = Buffer.concat(chunks);
        const parsed = await simpleParser(raw);
        messages.push({ raw, parsed, envelopeTo: session.envelope.rcptTo.map((r) => r.address), envelopeFrom: session.envelope.mailFrom ? session.envelope.mailFrom.address : false });
        if (dir) writeFileSync(path.join(dir, `${Date.now()}-${messages.length}.eml`), raw);
        callback();
      });
    },
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(sink.port, "127.0.0.1", () => resolve());
  });
  const address = server.server.address();
  if (address && typeof address === "object") sink.port = address.port;
  sink.close = () => new Promise<void>((resolve) => server.close(() => resolve()));
  return sink;
}

if (process.argv[1] && /dev-smtp\.(ts|js)$/.test(process.argv[1])) {
  startSmtpSink({ port: 2525, dir: path.resolve(".data/mail") }).then((sink) => {
    console.log(`SMTP sink listening on 127.0.0.1:${sink.port} — messages are written to .data/mail`);
  });
}
