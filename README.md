# Workout Tracker 💪

App mobile para registrar treinos e acompanhar evolução de cargas semana a semana.

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Firebase** (Authentication anônima + Firestore)
- Otimizado para iPhone 15 Pro (PWA installable)

---

## Configuração do Firebase — Passo a Passo

### 1. Criar o projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **Adicionar projeto**
3. Nome sugerido: `workout-tracker` ou `treino-ppl`
4. Pode desativar o Google Analytics (opcional)

---

### 2. Ativar Authentication (login anônimo)

1. No menu lateral, clique em **Authentication** → **Primeiros passos**
2. Vá na aba **Método de login**
3. Clique em **Anônimo** e ative
4. Salvar

---

### 3. Criar o Firestore Database

1. No menu lateral, clique em **Firestore Database** → **Criar banco de dados**
2. Selecione **Modo de produção** (as regras abaixo vão cuidar do acesso)
3. Escolha a região `southamerica-east1` (São Paulo — menor latência)
4. Clique em **Ativar**

---

### 4. Configurar as regras de segurança do Firestore

No Firestore, vá em **Regras** e cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workouts/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Isso garante que cada usuário só acessa os próprios dados.

---

### 5. Pegar as credenciais do projeto

1. Na página inicial do projeto Firebase, clique no ícone `</>` (Web)
2. Registre o app com o nome `workout-tracker`
3. **Não** marque Firebase Hosting por enquanto
4. Copie o objeto `firebaseConfig` que aparecer

---

### 6. Configurar o `.env.local`

Na raiz do projeto, copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

Edite o `.env.local` com os valores do `firebaseConfig`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

### 7. Instalar e rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Estrutura do Firestore

```
workouts/
  {uid}/                          ← ID anônimo do usuário (gerado automaticamente)
    sessions/
      1_Seg/                      ← Semana 1, Segunda
        exercises: [              ← Array de exercícios
          [                       ← Exercício 1
            { kg: "60", reps: "12" },   ← Série 1
            { kg: "65", reps: "10" },   ← Série 2
            { kg: "70", reps: "8" }     ← Série 3
          ],
          ...
        ]
        completedAt: "2025-03-30T..."  ← null se não concluído
      1_Ter/
      ...
      2_Seg/                      ← Semana 2, Segunda
      ...
```

---

## Deploy no Firebase Hosting (opcional)

```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
# Public dir: out | Single-page app: Yes
firebase deploy
```

---

## Instalar como app no iPhone

1. Abra o Safari e acesse a URL do app
2. Toque no botão de **Compartilhar** (ícone de caixinha com seta)
3. Toque em **Adicionar à Tela de Início**
4. O app abre sem barra de navegação, como um app nativo
