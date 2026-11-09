package br.ueg.trindade.artifact.Web_2_fullstack.dto;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Usuario;

// Resposta do login: o token JWT e os dados do usuário (sem a senha).
public record LoginResponse(String token, Usuario usuario) {
}
