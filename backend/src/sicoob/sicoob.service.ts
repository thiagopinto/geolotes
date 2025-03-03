import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as https from 'https';
import fetch from 'node-fetch'; // Bun precisa disso para suporte a agentes HTTPS
import {
  TOKEN_URL,
  CLIENT_ID,
  CERT_PATH_PFX,
  PASSPHRASE,
  CERT_PATH_PEM,
  KEY_PATH,
  IS_SANDBOX,
  scopes,
} from './sicoob.constants';
import path from 'path';

@Injectable()
export class SicoobService {
  async generateToken(): Promise<string> {
    if (IS_SANDBOX) {
      return this.generateTokenFake();
    }

    const scopeString = scopes.join(' ');

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID ? CLIENT_ID : '');
    params.append('scope', scopeString);

    try {
      let agent: https.Agent;

      if (fs.existsSync(path.join(__dirname, '..', CERT_PATH_PFX))) {
        const pfxCert = fs.readFileSync(
          path.join(__dirname, '..', CERT_PATH_PFX),
        );
        agent = new https.Agent({
          pfx: pfxCert,
          passphrase: PASSPHRASE,
          rejectUnauthorized: true,
        });
      } else if (
        fs.existsSync(path.join(__dirname, '..', CERT_PATH_PEM)) &&
        fs.existsSync(path.join(__dirname, '..', KEY_PATH))
      ) {
        const key = fs.readFileSync(path.join(__dirname, '..', KEY_PATH));
        const cert = fs.readFileSync(path.join(__dirname, '..', CERT_PATH_PEM));
        agent = new https.Agent({
          key: key,
          cert: cert,
          rejectUnauthorized: true,
        });
      } else {
        throw new Error(
          'Nenhum certificado válido encontrado (PFX ou PEM/KEY).',
        );
      }

      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
        // ⚠️ No Bun, fetch não suporta `agent`, mas node-fetch sim.
        agent: agent,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao gerar token: ${response.status} ${response.statusText}\nDetalhes: ${errorText}`,
        );
      }

      const data = (await response.json()) as {
        access_token: string;
        expires_in: number;
        token_type: string;
      };

      return data.access_token;
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      throw new Error('Falha ao obter o token do Sicoob');
    }
  }

  /**
   * Simula a geração de um token, com um pequeno delay para imitar a requisição real.
   */
  private async generateTokenFake(): Promise<string> {
    console.log('🔹 Modo Sandbox ativado: simulando geração de token...');
    await new Promise((resolve) => setTimeout(resolve, 500)); // Espera 500ms
    return '1301865f-c6bc-38f3-9f49-666dbcfc59c3';
  }
}
