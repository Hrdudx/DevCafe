package br.ueg.trindade.artifact.Web_2_fullstack.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.LinkedHashMap;
import java.util.Map;

// Quando o @Valid encontra campos inválidos, devolve 400 com a mensagem de cada campo,
// no formato { "message": "...", "erros": { "email": "Informe um e-mail válido" } },
// para o formulário do front-end mostrar o erro embaixo do campo certo.
@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> camposInvalidos(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new LinkedHashMap<>();
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            erros.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }
        String primeira = erros.values().stream().findFirst().orElse("Dados inválidos");

        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("status", HttpStatus.BAD_REQUEST.value());
        corpo.put("message", primeira);
        corpo.put("erros", erros);
        return ResponseEntity.badRequest().body(corpo);
    }

    // Arquivo maior que o limite do Spring (5 MB): responde com uma mensagem clara.
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> arquivoGrandeDemais(MaxUploadSizeExceededException ex) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("status", HttpStatus.BAD_REQUEST.value());
        corpo.put("message", "A imagem pode ter no máximo 2 MB");
        return ResponseEntity.badRequest().body(corpo);
    }
}
