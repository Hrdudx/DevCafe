package br.ueg.trindade.artifact.Web_2_fullstack.service;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Cliente;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.AvaliacaoRepository;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.ClienteRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    public ClienteService(ClienteRepository clienteRepository, AvaliacaoRepository avaliacaoRepository) {
        this.clienteRepository = clienteRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAllByOrderByNomeAsc();
    }

    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
    }

    public Cliente criar(Cliente cliente) {
        normalizar(cliente);
        validarEmailUnico(cliente.getEmail(), null);
        // Regra: a data de cadastro é sempre a do dia, definida pelo sistema.
        cliente.setDataCadastro(LocalDate.now());
        return clienteRepository.save(cliente);
    }

    public Cliente atualizar(Long id, Cliente clienteAtualizado) {
        Cliente cliente = buscarPorId(id);
        normalizar(clienteAtualizado);
        validarEmailUnico(clienteAtualizado.getEmail(), id);

        cliente.setNome(clienteAtualizado.getNome());
        cliente.setEmail(clienteAtualizado.getEmail());
        cliente.setTelefone(clienteAtualizado.getTelefone());
        cliente.setCep(clienteAtualizado.getCep());
        cliente.setEndereco(clienteAtualizado.getEndereco());

        return clienteRepository.save(cliente);
    }

    public void excluir(Long id) {
        buscarPorId(id);
        // Regra: um cliente que já avaliou produtos não pode ser apagado,
        // senão as avaliações ficariam sem autor.
        long quantidade = avaliacaoRepository.countByClienteId(id);
        if (quantidade > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este cliente tem " + quantidade + " avaliação(ões). Exclua as avaliações antes de excluir o cliente");
        }
        clienteRepository.deleteById(id);
    }

    // Tira espaços extras e guarda o e-mail em minúsculas, para a checagem de duplicidade funcionar.
    private void normalizar(Cliente cliente) {
        if (cliente.getNome() != null) cliente.setNome(cliente.getNome().trim());
        if (cliente.getEmail() != null) cliente.setEmail(cliente.getEmail().trim().toLowerCase());
        if (cliente.getTelefone() != null) cliente.setTelefone(cliente.getTelefone().trim());
        // Aceita "74000-000" e guarda só os números: "74000000".
        if (cliente.getCep() != null) cliente.setCep(cliente.getCep().replaceAll("\\D", ""));
        if (cliente.getEndereco() != null) cliente.setEndereco(cliente.getEndereco().trim());
    }

    // Regra: não pode haver dois clientes com o mesmo e-mail.
    private void validarEmailUnico(String email, Long idAtual) {
        clienteRepository.findByEmailIgnoreCase(email)
                .filter(existente -> !existente.getId().equals(idAtual))
                .ifPresent(existente -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um cliente cadastrado com esse e-mail");
                });
    }
}
