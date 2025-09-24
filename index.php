<?php
session_start();
// === CONFIGURATION ===
// Predefined admin password (change as needed)
$ADMIN_PASSWORD = 'Mercy@2025!'; // <- Edit this to set your admin password
// ======================

// Simple routing
$page = $_GET['page'] ?? 'home';
$action = $_GET['action'] ?? null;

// Handle logout
if ($action === 'logout') {
    session_unset();
    session_destroy();
    header('Location: ./');
    exit;
}

// Handle login POST
$loginError = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admin_password'])) {
    $pw = $_POST['admin_password'];
    if ($pw === $ADMIN_PASSWORD) {
        $_SESSION['is_admin'] = true;
        // initialize interns list if not present
        if (!isset($_SESSION['interns'])) {
            $_SESSION['interns'] = [
                ['name' => 'Amina N.', 'role' => 'Développement', 'start' => '2025-07-01'],
                ['name' => 'Jean K.', 'role' => 'Marketing', 'start' => '2025-08-10']
            ];
        }
        header('Location: ?page=dashboard');
        exit;
    } else {
        $loginError = 'Mot de passe incorrect.';
        $page = 'login';
    }
}

// Handle add intern (POST from dashboard)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_intern']) && !empty($_SESSION['is_admin'])) {
    $name = strip_tags(trim($_POST['intern_name']));
    $role = strip_tags(trim($_POST['intern_role']));
    $start = strip_tags(trim($_POST['intern_start']));
    if ($name && $role && $start) {
        $_SESSION['interns'][] = ['name' => $name, 'role' => $role, 'start' => $start];
        header('Location: ?page=dashboard');
        exit;
    }
}

// Helper: require admin
function require_admin()
{
    if (empty($_SESSION['is_admin'])) {
        header('Location: ?page=login');
        exit;
    }
}

// HTML head / assets
function head_section($title = 'Mercy Innovation Lab')
{
    return <<<HTML
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{$title}</title>
  <style>
    :root{
      --red:#b5121b;
      --black:#0b0b0b;
      --white:#ffffff;
      --muted:#f4f4f4;
      --glass: rgba(255,255,255,0.06);
    }
    *{box-sizing:border-box}
    body{margin:0;font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;background:linear-gradient(180deg,var(--white),#fff);color:var(--black)}
    a{color:var(--red);text-decoration:none}
    header.site-hero{background:linear-gradient(135deg,var(--red),#7a0f14);color:var(--white);padding:60px 20px 90px;position:relative;overflow:hidden}
    header .wrap{max-width:1100px;margin:0 auto;display:flex;gap:30px;align-items:center}
    .brand{font-weight:800;font-size:28px;letter-spacing:1px}
    .hero-left{flex:1}
    .hero-title{font-size:48px;margin:0 0 10px}
    .hero-sub{opacity:0.95;margin-bottom:18px}
    .cta{display:inline-block;padding:12px 20px;border-radius:10px;background:var(--black);color:var(--white);font-weight:600;box-shadow:0 6px 25px rgba(0,0,0,0.25);transform:translateY(0);transition:transform .18s}
    .cta:hover{transform:translateY(-4px)}
    .hero-right{width:420px;max-width:40%;}
    .card-planet{background:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));padding:18px;border-radius:18px;backdrop-filter: blur(6px);box-shadow:0 8px 40px rgba(0,0,0,0.25)}
    .logo-mark{width:64px;height:64px;border-radius:12px;background:var(--white);display:flex;align-items:center;justify-content:center;color:var(--red);font-weight:800;font-size:20px}

    /* NAV */
    nav.top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:28px}

    /* Dashboard layout */
    .container{max-width:1200px;margin:-70px auto 60px;padding:0 20px}
    .grid{display:grid;grid-template-columns:260px 1fr;gap:20px}
    .sidebar{background:var(--black);color:var(--white);Padding:18px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.25)}
    .nav-item{display:flex;gap:12px;align-items:center;padding:10px;border-radius:10px;margin-bottom:8px}
    .nav-item:hover{background:rgba(255,255,255,0.03);cursor:pointer}

    .panel{background:var(--white);padding:18px;border-radius:14px;box-shadow:0 10px 30px rgba(11,11,11,0.06)}
    .stats{display:flex;gap:12px;margin-bottom:14px}
    .stat{flex:1;padding:14px;border-radius:12px;background:linear-gradient(180deg,var(--white),var(--muted));text-align:center}
    .stat h3{margin:0;font-size:22px}
    .stat p{margin:6px 0 0;color:#666}

    table{width:100%;border-collapse:collapse}
    th,td{padding:10px;text-align:left;border-bottom:1px solid #efefef}

    /* Animated accents */
    .pulse{animation:pulse 2.8s infinite}
    @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.03)}100%{transform:scale(1)} }

    /* small screens */
    @media (max-width:880px){
      .grid{grid-template-columns:1fr;}
      .hero-title{font-size:32px}
      .hero-right{display:none}
    }

    /* login form */
    .login-wrap{max-width:420px;margin:40px auto;padding:26px;background:var(--white);border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,0.08)}
    .field{display:block;margin-bottom:12px}
    input[type=password], input[type=text], input[type=date]{width:100%;padding:12px;border-radius:10px;border:1px solid #e8e8e8}
    button.btn{background:var(--red);color:var(--white);padding:12px 16px;border-radius:10px;border:none;font-weight:700}

    footer{padding:26px 0;text-align:center;color:#666}
  </style>
  <script>
    // small helper to animate counters
    function animateCount(el, end){
      let start = 0; const dur = 900; const step = Math.ceil(end/(dur/16));
      const tick = setInterval(()=>{ start+=step; if(start>=end){el.textContent=end; clearInterval(tick)} else el.textContent=start },16);
    }
    document.addEventListener('DOMContentLoaded',()=>{
      document.querySelectorAll('[data-count]').forEach(el=> animateCount(el, parseInt(el.getAttribute('data-count')) || 0));
    });
  </script>
</head>
<body>
HTML;
}

// Render pages
if ($page === 'home') {
    echo head_section('Mercy Innovation Lab — Accueil');
    ?>
    <header class="site-hero">
      <div class="wrap">
        <div class="hero-left">
          <div class="brand">Mercy Innovation Lab</div>
          <h1 class="hero-title">Nous formons la prochaine génération de talents tech</h1>
          <p class="hero-sub">Startup basée à Douala — Programmes de stage pratiques, mentorat, et projets réels pour propulser les carrières.</p>
          <a class="cta" href="?page=login">Espace administrateur</a>
        </div>
        <div class="hero-right">
          <div class="card-planet">
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px">
              <div class="logo-mark">MI</div>
              <div>
                <strong>Mercy Innovation Lab</strong><br>
                <small>Innovation • Formation • Impact</small>
              </div>
            </div>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.9)">Notre mission est d'offrir aux étudiants et jeunes diplômés une immersion réelle dans des projets tech pour accélérer leur employabilité.</p>
          </div>
        </div>
      </div>
      <!-- decorative animated shapes -->
      <svg style="position:absolute;right:-120px;top:-40px;opacity:0.14" width="420" height="420" viewBox="0 0 200 200">
        <defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.06"/><stop offset="1" stop-color="#000" stop-opacity="0.02"/></linearGradient></defs>
        <circle cx="100" cy="60" r="80" fill="url(#g1)"></circle>
      </svg>
    </header>

    <main style="max-width:1100px;margin:40px auto;padding:0 20px">
      <section style="display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start">
        <article class="panel">
          <h2>Qui sommes-nous ?</h2>
          <p>Mercy Innovation Lab aide les jeunes talents à bâtir des compétences pratiques en travaillant sur de vrais projets. Nous offrons encadrement, ressources et opportunités de networking.</p>
        </article>
        <aside class="panel">
          <h3>Pourquoi nous choisir ?</h3>
          <ul>
            <li>Mentorat par des professionnels</li>
            <li>Projets réels et portfolio</li>
            <li>Évènements & workshops</li>
          </ul>
        </aside>
      </section>
    </main>

    <footer>
      &copy; Mercy Innovation Lab — Tous droits réservés
    </footer>
    </body>
    </html>
    <?php
    exit;
}

if ($page === 'login') {
    echo head_section('Connexion administrateur');
    ?>
    <main>
      <div class="login-wrap">
        <h2>Connexion Administrateur</h2>
        <?php if ($loginError): ?>
          <div style="color:#b5121b;margin-bottom:8px"><?=htmlspecialchars($loginError)?></div>
        <?php endif; ?>
        <form method="post" action="?page=login">
          <label class="field">Mot de passe</label>
          <input type="password" name="admin_password" required placeholder="Entrez le mot de passe admin">
          <div style="height:10px"></div>
          <button class="btn" type="submit">Se connecter</button>
        </form>
        <p style="margin-top:10px;color:#666;font-size:14px">Pas de base de données — le mot de passe est pré-défini dans le fichier PHP. Modifiez la variable <code>$ADMIN_PASSWORD</code> pour le changer.</p>
      </div>
    </main>
    </body>
    </html>
    <?php
    exit;
}

// Dashboard
require_admin();
$interns = $_SESSION['interns'] ?? [];
$totalInterns = count($interns);
$activeProjects = 3; // placeholder
$ongoingWorkshops = 2; // placeholder

echo head_section('Dashboard — Mercy Innovation Lab');
?>
<header style="padding:22px 20px;background:linear-gradient(90deg,var(--red),#8e1217);color:var(--white)">
  <div class="wrap" style="max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center">
    <div style="display:flex;align-items:center;gap:14px">
      <div style="width:52px;height:52px;border-radius:10px;background:var(--white);display:flex;align-items:center;justify-content:center;color:var(--red);font-weight:800">MI</div>
      <div>
        <div style="font-weight:700">Dashboard</div>
        <small style="opacity:0.85">Bienvenue, administrateur</small>
      </div>
    </div>
    <div style="display:flex;gap:12px;align-items:center">
      <a href="?action=logout" style="background:transparent;border:1px solid rgba(255,255,255,0.14);padding:10px 14px;border-radius:10px;color:var(--white)">Se déconnecter</a>
    </div>
  </div>
</header>

<main class="container">
  <div class="grid">
    <aside class="sidebar">
      <h3 style="margin-top:0">Menu</h3>
      <div class="nav-item"><strong>🏠</strong> Dashboard</div>
      <div class="nav-item"><strong>📋</strong> Stagiaires</div>
      <div class="nav-item"><strong>⚙️</strong> Paramètres</div>
      <div style="height:18px"></div>
      <small style="opacity:0.8">Mercy Innovation Lab</small>
    </aside>

    <section>
      <div class="panel pulse">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h2 style="margin:0">Vue d'ensemble</h2>
          <div style="color:#666">Tableau en temps réel</div>
        </div>
        <div class="stats" style="margin-top:14px">
          <div class="stat">
            <h3 data-count="<?=$totalInterns?>">0</h3>
            <p>Stagiaires</p>
          </div>
          <div class="stat">
            <h3 data-count="<?=$activeProjects?>">0</h3>
            <p>Projets actifs</p>
          </div>
          <div class="stat">
            <h3 data-count="<?=$ongoingWorkshops?>">0</h3>
            <p>Workshops</p>
          </div>
        </div>

        <div style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap">
          <div style="flex:1;min-width:220px">
            <h4>Rapide</h4>
            <p style="margin:6px 0 0;color:#555">Ajoutez ou gérez les stagiaires depuis le panneau ci-dessous. Les données sont conservées côté session (pas de base de données).</p>
          </div>
          <div style="width:320px">
            <form method="post" action="?page=dashboard" style="display:flex;gap:8px;flex-direction:column">
              <input type="text" name="intern_name" placeholder="Nom du stagiaire" required>
              <input type="text" name="intern_role" placeholder="Rôle / Département" required>
              <input type="date" name="intern_start" required>
              <input type="hidden" name="add_intern" value="1">
              <button class="btn" type="submit">Ajouter le stagiaire</button>
            </form>
          </div>
        </div>
      </div>

      <div style="height:18px"></div>

      <div class="panel">
        <h3 style="margin-top:0">Listes des stagiaires</h3>
        <table>
          <thead>
            <tr><th>Nom</th><th>Rôle</th><th>Date de début</th></tr>
          </thead>
          <tbody>
            <?php foreach($interns as $i): ?>
              <tr><td><?=htmlspecialchars($i['name'])?></td><td><?=htmlspecialchars($i['role'])?></td><td><?=htmlspecialchars($i['start'])?></td></tr>
            <?php endforeach; ?>
            <?php if(empty($interns)): ?>
              <tr><td colspan="3">Aucun stagiaire pour l'instant</td></tr>
            <?php endif; ?>
          </tbody>
        </table>
      </div>

      <div style="height:18px"></div>

      <div class="panel">
        <h3 style="margin-top:0">Activités récentes</h3>
        <ul>
          <li>2 stagiaires ont rejoint le programme en août 2025</li>
          <li>Workshop: \"Introduction au développement web\" — 12 septembre 2025</li>
        </ul>
      </div>

    </section>
  </div>
</main>

<footer>
  &copy; Mercy Innovation Lab — Dashboard
</footer>

</body>
</html>
<?php
