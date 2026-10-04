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

INSERT INTO produto (nome, descricao, preco, categoria, imagem_url)
SELECT 'Espresso', 'Café curto e encorpado', 6.50, 'Cafés', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=400&q=80'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Espresso');

-- Pedidos de exemplo, com horários relativos ao momento em que o banco é criado,
-- para o painel inicial e a lista de pedidos não começarem vazios.

INSERT INTO pedido (cliente, telefone, email, data_hora, status, total, forma_pagamento)
SELECT 'Felipe Almeida', '(62) 99134-5521', 'felipe@exemplo.com', DATEADD('MINUTE', -1500, LOCALTIMESTAMP), 'ENTREGUE', 18.80, 'Pix'
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE cliente = 'Felipe Almeida');

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Felipe Almeida') AND pr.nome = 'Cappuccino'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Felipe Almeida') AND pr.nome = 'Brownie'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO pedido (cliente, telefone, email, data_hora, status, total, forma_pagamento)
SELECT 'Rafael Costa', '(62) 98422-1037', 'rafael@exemplo.com', DATEADD('MINUTE', -1460, LOCALTIMESTAMP), 'ENTREGUE', 22.40, 'Cartão de débito'
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE cliente = 'Rafael Costa');

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Rafael Costa') AND pr.nome = 'Mocha'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Rafael Costa') AND pr.nome = 'Croissant'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO pedido (cliente, telefone, email, data_hora, status, total, forma_pagamento)
SELECT 'Beatriz Rocha', '(62) 99610-4482', 'beatriz@exemplo.com', DATEADD('MINUTE', -1420, LOCALTIMESTAMP), 'CANCELADO', 7.90, 'Pix'
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE cliente = 'Beatriz Rocha');

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Beatriz Rocha') AND pr.nome = 'Suco Natural'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO pedido (cliente, telefone, email, data_hora, status, total, forma_pagamento)
SELECT 'Mariana Santos', '(62) 98251-7790', 'mariana@exemplo.com', DATEADD('MINUTE', -1380, LOCALTIMESTAMP), 'ENTREGUE', 19.80, 'Cartão de crédito'
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE cliente = 'Mariana Santos');

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Mariana Santos') AND pr.nome = 'Mocha'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Mariana Santos') AND pr.nome = 'Pão de Queijo'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO pedido (cliente, telefone, email, data_hora, status, total, forma_pagamento)
SELECT 'Lucas Oliveira', '(62) 99877-3104', 'lucas@exemplo.com', DATEADD('MINUTE', -95, LOCALTIMESTAMP), 'CANCELADO', 23.70, 'Dinheiro'
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE cliente = 'Lucas Oliveira');

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Lucas Oliveira') AND pr.nome = 'Cappuccino'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 2, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Lucas Oliveira') AND pr.nome = 'Pão de Queijo'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO pedido (cliente, telefone, email, data_hora, status, total, forma_pagamento)
SELECT 'Juliana Lima', '(62) 98145-6623', 'juliana@exemplo.com', DATEADD('MINUTE', -70, LOCALTIMESTAMP), 'ENTREGUE', 16.00, 'Pix'
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE cliente = 'Juliana Lima');

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Juliana Lima') AND pr.nome = 'Espresso'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Juliana Lima') AND pr.nome = 'Croissant'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO pedido (cliente, telefone, email, data_hora, status, total, forma_pagamento)
SELECT 'Carlos Mendes', '(62) 99302-8815', 'carlos@exemplo.com', DATEADD('MINUTE', -35, LOCALTIMESTAMP), 'EM_PREPARO', 20.80, 'Cartão de débito'
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE cliente = 'Carlos Mendes');

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Carlos Mendes') AND pr.nome = 'Latte Gelado'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Carlos Mendes') AND pr.nome = 'Brownie'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO pedido (cliente, telefone, email, data_hora, status, total, forma_pagamento)
SELECT 'Ana Souza', '(62) 99999-1234', 'ana@exemplo.com', DATEADD('MINUTE', -10, LOCALTIMESTAMP), 'ENTREGUE', 32.60, 'Cartão de crédito'
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE cliente = 'Ana Souza');

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Ana Souza') AND pr.nome = 'Cappuccino'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 2, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Ana Souza') AND pr.nome = 'Pão de Queijo'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT pe.id, pr.id, 1, pr.preco FROM pedido pe, produto pr
WHERE pe.id = (SELECT MIN(id) FROM pedido WHERE cliente = 'Ana Souza') AND pr.nome = 'Brownie'
AND NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = pe.id AND i.produto_id = pr.id);
