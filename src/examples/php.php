<?php
/**
 * PHP Todo App Example
 *
 * This demonstrates:
 * - Session handling for state persistence
 * - Array manipulation
 * - Form processing with $_POST
 * - HTML templating with PHP
 */

session_start();

// Initialize todos array in session if not exists
if (!isset($_SESSION['todos'])) {
    $_SESSION['todos'] = [
        ['id' => 1, 'text' => 'Learn PHP', 'completed' => false],
        ['id' => 2, 'text' => 'Build a web app', 'completed' => false],
        ['id' => 3, 'text' => 'Deploy to production', 'completed' => false],
    ];
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'add':
                if (!empty($_POST['text'])) {
                    $newTodo = [
                        'id' => time(),
                        'text' => htmlspecialchars($_POST['text']),
                        'completed' => false
                    ];
                    $_SESSION['todos'][] = $newTodo;
                }
                break;

            case 'toggle':
                $id = (int)$_POST['id'];
                foreach ($_SESSION['todos'] as &$todo) {
                    if ($todo['id'] === $id) {
                        $todo['completed'] = !$todo['completed'];
                        break;
                    }
                }
                break;

            case 'delete':
                $id = (int)$_POST['id'];
                $_SESSION['todos'] = array_filter(
                    $_SESSION['todos'],
                    function($todo) use ($id) {
                        return $todo['id'] !== $id;
                    }
                );
                break;
        }
    }
    // Redirect to prevent form resubmission
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// Calculate stats
$total = count($_SESSION['todos']);
$completed = count(array_filter($_SESSION['todos'], fn($t) => $t['completed']));
$pending = $total - $completed;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Todo App</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        h1 { text-align: center; color: #333; }
        .input-container { display: flex; gap: 10px; margin-bottom: 20px; }
        input[type="text"] { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .delete-btn { background: #f44336; padding: 6px 12px; font-size: 14px; }
        ul { list-style: none; padding: 0; }
        li { display: flex; align-items: center; gap: 10px; padding: 12px; background: white; margin-bottom: 8px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .completed { text-decoration: line-through; color: #999; }
        .stats { margin-top: 20px; padding: 15px; background: white; border-radius: 4px; display: flex; justify-content: space-around; }
    </style>
</head>
<body>
    <h1>PHP Todo List</h1>

    <form method="POST" class="input-container">
        <input type="hidden" name="action" value="add">
        <input type="text" name="text" placeholder="Add a new todo..." required>
        <button type="submit">Add</button>
    </form>

    <ul>
        <?php foreach ($_SESSION['todos'] as $todo): ?>
            <li>
                <form method="POST" style="display: inline;">
                    <input type="hidden" name="action" value="toggle">
                    <input type="hidden" name="id" value="<?= $todo['id'] ?>">
                    <input type="checkbox" <?= $todo['completed'] ? 'checked' : '' ?>
                           onchange="this.form.submit()">
                </form>

                <span class="<?= $todo['completed'] ? 'completed' : '' ?>" style="flex: 1;">
                    <?= htmlspecialchars($todo['text']) ?>
                </span>

                <form method="POST" style="display: inline;">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= $todo['id'] ?>">
                    <button type="submit" class="delete-btn">Delete</button>
                </form>
            </li>
        <?php endforeach; ?>
    </ul>

    <div class="stats">
        <p><strong>Total:</strong> <?= $total ?></p>
        <p><strong>Completed:</strong> <?= $completed ?></p>
        <p><strong>Pending:</strong> <?= $pending ?></p>
    </div>
</body>
</html>
