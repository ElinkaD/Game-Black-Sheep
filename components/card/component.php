<?php
$cardTypes = [
    'default' => [
        'image_path' => '../img/{type}.png'
    ],
    'сорока-воровка' => [
        'image_path' => '../img/magpiethief.png'
    ],
    'крот' => [
        'image_path' => '../img/mole.png'
    ],
    'орел' => [
        'image_path' => '../img/eagle.png'
    ],
    'черная овечка' => [
        'image_path' => '../img/blacksheep.png'
    ]
];

function renderCard($id, $calculatedType = null, $cardType = null) {
    global $cardTypes;

    if ($cardType === 'null') {
        $type = $calculatedType;
        $cardConfig = $cardTypes['default'];
        $imagePath = str_replace('{type}', $type, $cardConfig['image_path']);
    } else {
        $type = $cardType;
        $cardConfig = $cardTypes[$type];
        $imagePath = $cardConfig['image_path'];
    }
    
    // onclick='handleCardClick({$id}

    return "
    <div class='card' data-id='{$id}' data-type='{$type}')'>
        <img src='{$imagePath}' alt='Карта {$type}' draggable='false'>
    </div>";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получение данных
    $id = $_POST['id'];
    $calculatedType = $_POST['calculated_type'];
    $cardType = $_POST['card_type'];

    // Вывод карты
    echo renderCard($id, $calculatedType, $cardType);
}
?>
