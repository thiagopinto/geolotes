export interface Boletos {}

export interface IPagador {
  numeroCpfCnpj: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  cep: string;
  uf: string;
  email: string;
}

export interface IRateioCreditos {
  numeroBanco: number;
  numeroAgencia: number;
  numeroContaCorrente: number;
  contaPrincipal: boolean;
  codigoTipoValorRateio: number;
  valorRateio: number;
  codigoTipoCalculoRateio: number;
  numeroCpfCnpjTitular: string;
  nomeTitular: string;
  codigoFinalidadeTed: number;
  codigoTipoContaDestinoTed: string;
  quantidadeDiasFloat: number;
  dataFloatCredito: string;
}

export interface IBeneficiarioFinal {
  numeroCpfCnpj: string;
  nome: string;
}

export interface IIncluirBoletoRequest {
  numeroCliente: number;
  codigoModalidade: number;
  numeroContaCorrente: number;
  codigoEspecieDocumento: string;
  dataEmissao: string;
  nossoNumero: number;
  seuNumero: string;
  identificacaoBoletoEmpresa: string;
  identificacaoEmissaoBoleto: number;
  identificacaoDistribuicaoBoleto: number;
  valor: number;
  dataVencimento: string;
  dataLimitePagamento: string;
  valorAbatimento: number;
  tipoDesconto: number;
  dataPrimeiroDesconto: string;
  valorPrimeiroDesconto: number;
  dataSegundoDesconto: string;
  valorSegundoDesconto: number;
  dataTerceiroDesconto: string;
  valorTerceiroDesconto: number;
  tipoMulta: number;
  dataMulta: string;
  valorMulta: number;
  tipoJurosMora: number;
  dataJurosMora: string;
  valorJurosMora: number;
  numeroParcela: number;
  aceite: boolean;
  codigoNegativacao: number;
  numeroDiasNegativacao: number;
  codigoProtesto: number;
  numeroDiasProtesto: number;
  pagador: IPagador;
  beneficiarioFinal: IBeneficiarioFinal;
  mensagensInstrucao: string[];
  gerarPdf: boolean;
  rateioCreditos: [IRateioCreditos];
  codigoCadastrarPIX: number;
  numeroContratoCobranca: number;
}
