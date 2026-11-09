package br.ueg.trindade.artifact.Web_2_fullstack.controller;

import br.ueg.trindade.artifact.Web_2_fullstack.dto.LoginRequest;
import br.ueg.trindade.artifact.Web_2_fullstack.dto.LoginResponse;
import br.ueg.trindade.artifact.Web_2_fullstack.model.Usuario;
import br.ueg.trindade.artifact.Web_2_fullstack.security.JwtUtil;
import br.ueg.trindade.artifact.Web_2_fullstack.service.UsuarioService;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "http://localhost:*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    // Confere e-mail e senha (401 se não baterem) e devolve um token JWT.
    // O front-end manda esse token no cabeçalho Authorization das próximas requisições.
    @PostMapping("/login")
    @Transactional(readOnly = true)
    public LoginResponse login(@RequestBody LoginRequest dados) {
        Usuario usuario = usuarioService.autenticar(dados.getEmail(), dados.getSenha());
        return new LoginResponse(jwtUtil.gerarToken(usuario), usuario);
    }
}
