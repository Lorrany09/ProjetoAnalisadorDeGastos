<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $tipo = isset($_GET['tipo']) ? $_GET['tipo'] : '';
    
    if ($tipo == 'total_pagos') {
        $sql = "SELECT SUM(valor) as total FROM gastos WHERE pago = 'sim'";
        $stmt = $pdo->query($sql);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode(['total' => $resultado['total'] ?? 0]);
    }
    
    else if ($tipo == 'total_naopagos') {
        $sql = "SELECT SUM(valor) as total FROM gastos WHERE pago = 'nao'";
        $stmt = $pdo->query($sql);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode(['total' => $resultado['total'] ?? 0]);
    }
    
    else if ($tipo == 'categorias') {
        $sql = "SELECT c.nome, SUM(g.valor) as total 
                FROM gastos g
                JOIN categorias c ON g.categoria_id = c.id
                GROUP BY c.id";
        
        $stmt = $pdo->query($sql);
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($resultado);
    }
    
    else if ($tipo == 'meses') {
        $sql = "SELECT DATE_FORMAT(data, '%Y-%m') as mes, SUM(valor) as total
                FROM gastos
                GROUP BY DATE_FORMAT(data, '%Y-%m')
                ORDER BY mes DESC
                LIMIT 6";
        
        $stmt = $pdo->query($sql);
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $resultado = array_reverse($resultado);
        
        echo json_encode($resultado);
    }
    
    else if ($tipo == 'listar') {
        $sql = "SELECT g.*, c.nome as categoria_nome
                FROM gastos g
                JOIN categorias c ON g.categoria_id = c.id
                ORDER BY g.data DESC";
        
        $stmt = $pdo->query($sql);
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($resultado);
    }
    
    else if ($tipo == 'categorias_lista') {
        $sql = "SELECT * FROM categorias ORDER BY nome";
        $stmt = $pdo->query($sql);
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($resultado);
    }
}

else if ($method == 'POST') {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    $sql = "INSERT INTO gastos (nome, valor, data, pago, categoria_id, tipo_pagamento) 
            VALUES (:nome, :valor, :data, :pago, :categoria_id, :tipo)";
    
    $stmt = $pdo->prepare($sql);
    
    $sucesso = $stmt->execute([
        ':nome' => $dados['nome'],
        ':valor' => $dados['valor'],
        ':data' => $dados['data'],
        ':pago' => $dados['pago'],
        ':categoria_id' => $dados['categoria_id'],
        ':tipo' => $dados['tipo_pagamento']
    ]);
    
    echo json_encode(['sucesso' => $sucesso]);
}

else if ($method == 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($id) {
        $sql = "DELETE FROM gastos WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $sucesso = $stmt->execute([':id' => $id]);
        
        echo json_encode(['sucesso' => $sucesso]);
    }
}
?>