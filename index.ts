// 1. Sistema de cobrança engessado
class SistemaCobrancaStripe {
    cobrar(usuarioId: string, valorTokens: number): void {
        console.log(`Cobrando R$${valorTokens} via Stripe do usuário ${usuarioId}`);
    }
}

// 1.1 Serviço dedicado à cobrança
class ServicoCobranca {
    constructor(private sistemaCobranca: SistemaCobrancaStripe) {}

    registrarCobranca(usuarioId: string, valor: number): void {
        this.sistemaCobranca.cobrar(usuarioId, valor);
    }
}

// 2. Contrato para cada tipo de geração de IA
interface IGeradorIA {
    tipo: string;
    gerar(prompt: string): string;
}

class GeradorTexto implements IGeradorIA {
    tipo = "TEXTO";

    gerar(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }
}

class GeradorImagem implements IGeradorIA {
    tipo = "IMAGEM";

    gerar(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }
}

class GeradorAudio implements IGeradorIA {
    tipo = "AUDIO";

    gerar(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }
}

// 3. A classe principal que gerencia tudo
class AssistenteOmniIA {
    public nomeModelo: string;
    private geradores: Map<string, IGeradorIA>;

    constructor(
        nomeModelo: string,
        private servicoCobranca: ServicoCobranca,
        geradores: IGeradorIA[]
    ) {
        this.nomeModelo = nomeModelo;
        this.geradores = new Map(geradores.map((gerador) => [gerador.tipo, gerador]));
    }

    processarRequisicaoUsuario(prompt: string, tipo: string): void {
        console.log(`Iniciando processamento com ${this.nomeModelo}...`);

        const gerador = this.geradores.get(tipo);

        if (!gerador) {
            throw new Error("Tipo de IA não suportado pelo sistema.");
        }

        gerador.gerar(prompt);
       
        this.servicoCobranca.registrarCobranca("user_999", 1.50);
    }
}

// 4. Um modelo específico configura um assistente com as capacidades que possui
class ModeloFocadoEmTexto {
    criarAssistente(servicoCobranca: ServicoCobranca): AssistenteOmniIA {
        return new AssistenteOmniIA("ChatGPT-4", servicoCobranca, [
            new GeradorTexto()
        ]);
    }
}
