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

// 2. Interfaces pequenas para cada capacidade de IA
interface IProcessadorRequisicaoIA {
    tipo: string;
    processar(prompt: string): string;
}

interface IGeradorTexto {
    gerarTexto(prompt: string): string;
}

interface IGeradorImagem {
    gerarImagem(prompt: string): string;
}

interface IGeradorAudio {
    gerarAudio(prompt: string): string;
}

class GeradorTexto implements IGeradorTexto, IProcessadorRequisicaoIA {
    tipo = "TEXTO";

    gerarTexto(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }

    processar(prompt: string): string {
        return this.gerarTexto(prompt);
    }
}

class GeradorImagem implements IGeradorImagem, IProcessadorRequisicaoIA {
    tipo = "IMAGEM";

    gerarImagem(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }

    processar(prompt: string): string {
        return this.gerarImagem(prompt);
    }
}

class GeradorAudio implements IGeradorAudio, IProcessadorRequisicaoIA {
    tipo = "AUDIO";

    gerarAudio(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }

    processar(prompt: string): string {
        return this.gerarAudio(prompt);
    }
}

// 3. A classe principal que gerencia tudo
class AssistenteOmniIA {
    public nomeModelo: string;
    private processadores: Map<string, IProcessadorRequisicaoIA>;

    constructor(
        nomeModelo: string,
        private servicoCobranca: ServicoCobranca,
        processadores: IProcessadorRequisicaoIA[]
    ) {
        this.nomeModelo = nomeModelo;
        this.processadores = new Map(
            processadores.map((processador) => [processador.tipo, processador])
        );
    }

    processarRequisicaoUsuario(prompt: string, tipo: string): void {
        console.log(`Iniciando processamento com ${this.nomeModelo}...`);

        const processador = this.processadores.get(tipo);

        if (!processador) {
            throw new Error("Tipo de IA não suportado pelo sistema.");
        }

        processador.processar(prompt);
       
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
