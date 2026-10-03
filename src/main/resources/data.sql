INSERT INTO produto (nome, descricao, preco, categoria, imagem_url)
SELECT 'Cappuccino', 'Café espresso com leite cremoso e canela', 9.90, 'Cafés', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Cappuccino');

INSERT INTO produto (nome, descricao, preco, categoria, imagem_url)
SELECT 'Pão de Queijo', 'Tradicional e irresistível', 6.90, 'Salgados', 'https://images.unsplash.com/photo-1619535860434-ba1d8fa28f78?auto=format&fit=crop&w=400&q=80'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Pão de Queijo');

INSERT INTO produto (nome, descricao, preco, categoria, imagem_url)
SELECT 'Latte Gelado', 'Café, leite e muito gelo', 11.90, 'Bebidas Geladas', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Latte Gelado');

INSERT INTO produto (nome, descricao, preco, categoria, imagem_url)
SELECT 'Brownie', 'Chocolate intenso', 8.90, 'Doces', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Brownie');

INSERT INTO produto (nome, descricao, preco, categoria, imagem_url)
SELECT 'Croissant', 'Manteiga e leveza', 9.50, 'Lanches', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Croissant');

INSERT INTO produto (nome, descricao, preco, categoria, imagem_url)
SELECT 'Mocha', 'Café, chocolate e chantili', 12.90, 'Cafés', 'https://images.unsplash.com/photo-1572286258217-215cf8e667ca?auto=format&fit=crop&w=400&q=80'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Mocha');

INSERT INTO produto (nome, descricao, preco, categoria, imagem_url)
SELECT 'Suco Natural', 'Laranja, 300 ml', 7.90, 'Bebidas Geladas', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=80'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Suco Natural');

INSERT INTO produto (nome, descricao, preco, categoria, imagem_url)
SELECT 'Coxinha', 'Tradicional', 7.50, 'Salgados', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Coxinha');
