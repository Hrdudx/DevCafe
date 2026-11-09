package br.ueg.trindade.artifact.Web_2_fullstack.service;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Produto;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.AvaliacaoRepository;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.ItemPedidoRepository;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.ProdutoRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ProdutoService {

    // Regra do upload: só imagens, de até 2 MB.
    private static final long TAMANHO_MAXIMO = 2 * 1024 * 1024;
    private static final Map<String, String> EXTENSOES = Map.of(
            "image/png", ".png",
            "image/jpeg", ".jpg",
            "image/webp", ".webp",
            "image/gif", ".gif");

    @Value("${devcafe.uploads.dir}")
    private String pastaUploads;

    private final ProdutoRepository produtoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    public ProdutoService(ProdutoRepository produtoRepository, ItemPedidoRepository itemPedidoRepository,
                          AvaliacaoRepository avaliacaoRepository) {
        this.produtoRepository = produtoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    public Produto criar(Produto produto) {
        validarPreco(produto);
        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        validarPreco(produtoAtualizado);
        Produto produto = buscarPorId(id);

        produto.setNome(produtoAtualizado.getNome());
        produto.setDescricao(produtoAtualizado.getDescricao());
        produto.setPreco(produtoAtualizado.getPreco());
        produto.setCategoria(produtoAtualizado.getCategoria());
        produto.setImagemUrl(produtoAtualizado.getImagemUrl());

        return produtoRepository.save(produto);
    }

    public void excluir(Long id) {
        buscarPorId(id);
        // Um produto que já aparece em pedidos não pode sumir, senão o histórico quebra.
        if (itemPedidoRepository.existsByProdutoId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este produto já aparece em pedidos e não pode ser excluído");
        }
        if (avaliacaoRepository.existsByProdutoId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este produto tem avaliações de clientes e não pode ser excluído");
        }
        produtoRepository.deleteById(id);
    }

    private void validarPreco(Produto produto) {
        if (produto.getNome() == null || produto.getNome().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o nome do produto");
        }
        if (produto.getPreco() == null || produto.getPreco() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O preço do produto deve ser maior que zero");
        }
    }

    // N2 (extra) — upload da foto do produto (MultipartFile).
    // Grava o arquivo em uploads/produtos/ e guarda o endereço dele em imagemUrl.
    public Produto salvarImagem(Long id, MultipartFile arquivo) {
        Produto produto = buscarPorId(id);

        if (arquivo == null || arquivo.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Escolha uma imagem para enviar");
        }
        String extensao = EXTENSOES.get(arquivo.getContentType());
        if (extensao == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie uma imagem PNG, JPG, WEBP ou GIF");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A imagem pode ter no máximo 2 MB");
        }

        // Nome único gerado pelo sistema (nunca o nome original), para não sobrescrever outra foto.
        String nomeArquivo = "produto-" + id + "-" + UUID.randomUUID() + extensao;
        Path pasta = Path.of(pastaUploads, "produtos").toAbsolutePath();
        try (InputStream conteudo = arquivo.getInputStream()) {
            Files.createDirectories(pasta);
            Files.copy(conteudo, pasta.resolve(nomeArquivo), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível salvar a imagem");
        }

        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/produtos/").path(nomeArquivo).toUriString();
        produto.setImagemUrl(url);
        return produtoRepository.save(produto);
    }
}
