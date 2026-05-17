# Deploiement Gratuit Sur Oracle Cloud

Ce guide deploie l'application Gestion RH sur une VM Oracle Cloud Always Free.

## 1. Creer La VM

Dans Oracle Cloud :

- Create instance
- Image : Ubuntu 22.04 ou 24.04
- Shape : Always Free eligible
- Ajouter ta cle SSH
- Ouvrir les ports dans Security List ou Network Security Group :
  - `22` SSH
  - `80` HTTP
  - `443` HTTPS plus tard si domaine

## 2. Se Connecter En SSH

Depuis ton PC :

```bash
ssh ubuntu@IP_PUBLIQUE_ORACLE
```

## 3. Envoyer Le Projet Vers La VM

Depuis ton PC, dans le dossier parent du projet :

```bash
scp -r GestionRH ubuntu@IP_PUBLIQUE_ORACLE:/home/ubuntu/GestionRH
```

Si tu utilises GitHub, tu peux aussi faire :

```bash
git clone TON_REPO_GITHUB GestionRH
```

## 4. Installer Et Lancer

Sur la VM :

```bash
cd /home/ubuntu/GestionRH
chmod +x deploy/oracle-cloud-setup.sh
./deploy/oracle-cloud-setup.sh
```

L'application sera disponible ici :

```text
http://IP_PUBLIQUE_ORACLE
```

## 5. Connexion

Compte admin :

```text
Email: admin@gestionrh.com
Password: admin123
```

## 6. Commandes Utiles

Voir les conteneurs :

```bash
docker compose ps
```

Voir les logs :

```bash
docker compose logs -f
```

Redemarrer :

```bash
docker compose restart
```

Arreter :

```bash
docker compose down
```

Relancer apres modification :

```bash
docker compose up -d --build
```

Sauvegarder la base PostgreSQL :

```bash
docker exec gestion-rh-postgres pg_dump -U postgres gestion_rh > backup_gestion_rh.sql
```

Restaurer la base :

```bash
cat backup_gestion_rh.sql | docker exec -i gestion-rh-postgres psql -U postgres -d gestion_rh
```

## 7. Notes Importantes

- Oracle Always Free peut rester gratuit sans expiration si tu restes dans les limites Always Free.
- Une VM inactive peut etre consideree comme idle selon les regles Oracle.
- Ne supprime pas le volume Docker `postgres_data`, sinon les donnees PostgreSQL seront perdues.
- Change le mot de passe admin depuis l'application si tu l'utilises en production.
