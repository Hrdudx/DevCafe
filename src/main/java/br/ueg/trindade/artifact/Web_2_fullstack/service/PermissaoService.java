package br.ueg.trindade.artifact.Web_2_fullstack.service;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Permissao;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.PermissaoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissaoService {

    private final PermissaoRepository permissaoRepository;

    public PermissaoService(PermissaoRepository permissaoRepository) {
        this.permissaoRepository = permissaoRepository;
    }

    public List<Permissao> listarTodos() {
        return permissaoRepository.findAll();
    }

    public Permissao buscarPorId(Long id) {
        return permissaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permissão não encontrada"));
    }

    public Permissao criar(Permissao permissao) {
        validarNome(permissao);
        return permissaoRepository.save(permissao);
    }

    public Permissao atualizar(Long id, Permissao permissaoAtualizada) {
        validarNome(permissaoAtualizada);
        Permissao permissao = buscarPorId(id);

        permissao.setNome(permissaoAtualizada.getNome());
        permissao.setDescricao(permissaoAtualizada.getDescricao());

        return permissaoRepository.save(permissao);
    }

    public void excluir(Long id) {
        buscarPorId(id);
        permissaoRepository.deleteById(id);
    }

    private void validarNome(Permissao permissao) {
        if (permissao.getNome() == null || permissao.getNome().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o nome da permissão");
        }
    }
}
