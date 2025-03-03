export const TOKEN_URL = process.env.SICOOB_TOKEN_URL
  ? process.env.SICOOB_TOKEN_URL
  : '';
export const API_BASE_URL = process.env.SICOOB_API_BASE_URL
  ? process.env.SICOOB_API_BASE_URL
  : '';
export const CLIENT_ID = process.env.SICOOB_CLIENT_ID
  ? process.env.SICOOB_CLIENT_ID
  : '';
export const CERT_PATH_PFX = process.env.SICOOB_CERT_PATH_PFX
  ? process.env.SICOOB_CERT_PATH_PFX
  : '';
export const PASSPHRASE = process.env.SICOOB_PASSPHRASE
  ? process.env.SICOOB_PASSPHRASE
  : '';
export const CERT_PATH_PEM = process.env.SICOOB_CERT_PATH_PEM
  ? process.env.SICOOB_CERT_PATH_PEM
  : '';
export const KEY_PATH = process.env.SICOOB_KEY_PATH
  ? process.env.SICOOB_KEY_PATH
  : '';
export const IS_SANDBOX = process.env.SICOOB_IS_SANDBOX === 'true';
export const scopes = [
  'cobranca_boletos_consultar',
  'cobranca_boletos_incluir',
  'cobranca_boletos_pagador',
  'cobranca_boletos_segunda_via',
  'cobranca_boletos_descontos',
  'cobranca_boletos_abatimentos',
  'cobranca_boletos_valor_nominal',
  'cobranca_boletos_seu_numero',
  'cobranca_boletos_especie_documento',
  'cobranca_boletos_baixa',
  'cobranca_boletos_rateio_credito',
  'cobranca_pagadores',
  'cobranca_boletos_negativacoes_incluir',
  'cobranca_boletos_negativacoes_alterar',
  'cobranca_boletos_negativacoes_baixar',
  'cobranca_boletos_protestos_incluir',
  'cobranca_boletos_protestos_alterar',
  'cobranca_boletos_protestos_desistir',
  'cobranca_boletos_solicitacao_movimentacao_incluir',
  'cobranca_boletos_solicitacao_movimentacao_consultar',
  'cobranca_boletos_solicitacao_movimentacao_download',
  'cobranca_boletos_prorrogacoes_data_vencimento',
  'cobranca_boletos_prorrogacoes_data_limite_pagamento',
  'cobranca_boletos_encargos_multas',
  'cobranca_boletos_encargos_juros_mora',
  'cobranca_boletos_pix',
];
