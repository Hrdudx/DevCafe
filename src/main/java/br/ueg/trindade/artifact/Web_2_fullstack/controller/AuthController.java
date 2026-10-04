package br.ueg.trindade.artifact.Web_2_fullstack.controller;

import br.ueg.trindade.artifact.Web_2_fullstack.dto.LoginRequest;
import br.ueg.trindade.artifact.Web_2_fullstack.model.Usuario;
import br.ueg.trindade.artifact.Web_2_fullstack.service.UsuarioService;

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

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Confere e-mail e senha de um usuário cadastrado. Responde 401 se não baterem.
    @PostMapping("/login")
    public Usuario login(@RequestBody LoginRequest dados) {
        return usuarioService.autenticar(dados.getEmail(), dados.getSenha());
    }
}
