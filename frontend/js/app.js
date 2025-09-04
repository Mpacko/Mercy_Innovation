    loadStagiaires();

    const form = document.getElementById('addForm');
    if (form) {
        form.onsubmit = async function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const res = await fetch('../backend/stagiaires/add_stagiaire.php', {
                method: 'POST',
                body: formData
            });
            if (await res.text() === 'success') {
                form.reset();
                loadStagiaires();
            }
        };
    }
});

function loadStagiaires() {
    fetch('../backend/stagiaires/get_stagiaires.php')
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#stagiaires tbody');
            tbody.innerHTML = '';
            data.forEach(stagiaire => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${stagiaire.nom}</td>
                    <td>${stagiaire.prenom}</td>
                    <td>${stagiaire.email}</td>
                    <td>${stagiaire.telephone}</td>
                    <td>${stagiaire.departement}</td>
                    <td>${stagiaire.date_debut}</td>
                    <td>${stagiaire.date_fin}</td>
                    <td>
                        <button onclick="deleteStagiaire(${stagiaire.id})" class="btn">Supprimer</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
}

function deleteStagiaire(id) {
    fetch('../backend/stagiaires/delete_stagiaire.php', {
        method: 'POST',
        body: new URLSearchParams({ id })
    })
    .then(res => res.text())
    .then(txt => {
        if (txt === 'deleted') loadStagiaires();
    });
}