import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length) {
      env[key.trim()] = rest.join("=").trim().replace(/(^['"]|['"]$)/g, "");
    }
  });
  return env;
}

function prompt(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function runSetup() {
  console.log("=====================================================");
  console.log("  G&C Solutions — Configuração Automática da Base de Dados");
  console.log("=====================================================\n");

  const env = loadEnv();
  let dbUrl = process.argv[2] || env.DATABASE_URL || env.SUPABASE_DB_URL;

  if (!dbUrl) {
    console.log("Para conectar diretamente ao Supabase sem abrir o SQL Editor,");
    console.log("precisamos da URL de Conexão PostgreSQL (Connection String).");
    console.log("\nEncontra esta URL em: Supabase -> Project Settings -> Database -> Connection string (URI)\n");
    dbUrl = await prompt("Cole aqui a Connection String do Supabase (postgres://...): ");
  }

  if (!dbUrl) {
    console.error("\n❌ Nenhuma URL de conexão foi fornecida. Abortando.");
    process.exit(1);
  }

  console.log("\n⏳ A ligar à base de dados PostgreSQL no Supabase...");

  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("✔ Ligação estabelecida com sucesso!");

    // 1. Executar schema.sql
    const schemaPath = path.join(rootDir, "supabase", "schema.sql");
    console.log(`\n⏳ A ler e executar o esquema DDL (${schemaPath})...`);
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    await client.query(schemaSql);
    console.log("✔ Esquema criado com sucesso:");
    console.log("   • 9 tabelas relacionais (profiles, listings, vehicles, properties, listing_images, etc.)");
    console.log("   • Índices de alta performance e chaves estrangeiras");
    console.log("   • Políticas de Segurança Row Level Security (RLS)");
    console.log("   • Trigger do Primeiro Administrador AUTOMÁTICO ativado!");

    // 2. Executar seed.sql
    const seedPath = path.join(rootDir, "supabase", "seed.sql");
    if (fs.existsSync(seedPath)) {
      console.log(`\n⏳ A inserir catálogo inicial de viaturas e imóveis (${seedPath})...`);
      const seedSql = fs.readFileSync(seedPath, "utf-8");
      await client.query(seedSql);
      console.log("✔ Dados de demonstração e configurações da plataforma inseridos!");
    }

    // 3. Salvar DATABASE_URL no .env se não estiver presente
    const envPath = path.join(rootDir, ".env");
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";
    if (!envContent.includes("DATABASE_URL=")) {
      envContent += `\nDATABASE_URL=${dbUrl}\n`;
      fs.writeFileSync(envPath, envContent, "utf-8");
      console.log("✔ DATABASE_URL guardada no ficheiro .env");
    }

    console.log("\n=====================================================");
    console.log("🎉 CONFIGURAÇÃO AUTOMÁTICA CONCLUÍDA COM SUCESSO!");
    console.log("=====================================================");
    console.log("1. A base de dados Supabase está 100% pronta.");
    console.log("2. O primeiro utilizador que registar na plataforma");
    console.log("   (em http://localhost:8080/registar) será automaticamente");
    console.log("   definido como ADMINISTRADOR com acesso total a /admin.");
    console.log("=====================================================\n");
  } catch (err) {
    console.error("\n❌ Ocorreu um erro durante a configuração:");
    console.error(err.message);
  } finally {
    await client.end();
  }
}

runSetup();