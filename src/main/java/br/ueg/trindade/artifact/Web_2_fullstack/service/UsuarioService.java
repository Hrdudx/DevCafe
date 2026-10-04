package br.ueg.trindade.artifact.Web_2_fullstack.service;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Usuario;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public Usuario criar(Usuario usuario) {
        validarEmailUnico(usuario.getEmail(), null);
        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe uma senha para o usuário");
        }
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
        Usuario usuario = buscarPorId(id);
        validarEmailUnico(usuarioAtualizado.getEmail(), id);

        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setUsername(usuarioAtualizado.getUsername());
        usuario.setEmail(usuarioAtualizado.getEmail());
        // Senha em branco na edição significa "manter a senha atual".
        if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(usuarioAtualizado.getSenha()));
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario autenticar(String email, String senha) {
        return usuarioRepository.findByEmail(email)
                .filter(usuario -> usuario.getSenha() != null && senha != null
                        && passwordEncoder.matches(senha, usuario.getSenha()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos"));
    }

    public void excluir(Long id) {
        buscarPorId(id);
        usuarioRepository.deleteById(id);
    }

    private void validarEmailUnico(String email, Long idAtual) {
        usuarioRepository.findByEmail(email)
                .filter(usuarioExistente -> !usuarioExistente.getId().equals(idAtual))
                .ifPresent(usuarioExistente -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um usuário cadastrado com esse e-mail");
                });
    }
}
