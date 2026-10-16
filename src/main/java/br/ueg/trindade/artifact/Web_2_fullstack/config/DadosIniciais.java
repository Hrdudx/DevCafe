package br.ueg.trindade.artifact.Web_2_fullstack.config;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Usuario;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.PermissaoRepository;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.UsuarioRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DadosIniciais {

    // Cria um administrador na primeira vez que a aplicação sobe, para que
    // sempre exista alguém capaz de entrar e cadastrar os demais usuários.
    // A senha fica em Java (e não no data.sql) para ser gravada já criptografada.
    // O perfil ADMIN vem do data.sql, que roda antes deste código.
    @Bean
    public CommandLineRunner criarAdministrador(UsuarioRepository usuarioRepository,
                                                PermissaoRepository permissaoRepository,
                                                PasswordEncoder passwordEncoder) {
        return args -> {
            if (usuarioRepository.findByEmail("admin@devcafe.com").isEmpty()) {
                Usuario admin = new Usuario(
                        "Administrador",
                        "admin",
                        passwordEncoder.encode("admin123"),
                        "admin@devcafe.com");
                permissaoRepository.findByNome("ADMIN").ifPresent(admin.getPermissoes()::add);
                usuarioRepository.save(admin);
            }
        };
    }
}
