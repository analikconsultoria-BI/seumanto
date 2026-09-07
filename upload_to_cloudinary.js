/**
 * upload_to_cloudinary.js
 * Sobe todas as imagens de assets/catalog/ para o Cloudinary.
 * Suporta retomada — pula arquivos já enviados.
 * Usa 5 uploads em paralelo para velocidade.
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const catalogDir = path.join(__dirname, 'assets', 'catalog');
const progressFile = path.join(__dirname, 'cloudinary_upload_progress.json');
const CONCURRENCY = 5;

async function main() {
  // Verificar credenciais
  if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'SEU_API_KEY_AQUI') {
    console.error('❌ Preencha CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no arquivo .env');
    process.exit(1);
  }

  const allFiles = fs.readdirSync(catalogDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  console.log(`Total de imagens: ${allFiles.length}`);

  // Carregar progresso anterior
  let done = new Set();
  if (fs.existsSync(progressFile)) {
    try {
      done = new Set(JSON.parse(fs.readFileSync(progressFile, 'utf8')));
      console.log(`Retomando — já enviados: ${done.size}`);
    } catch(e) {}
  }

  const toUpload = allFiles.filter(f => !done.has(f));
  console.log(`A enviar: ${toUpload.length}\n`);

  let success = 0, failed = 0;
  const failedList = [];

  // Processar em lotes de CONCURRENCY
  for (let i = 0; i < toUpload.length; i += CONCURRENCY) {
    const batch = toUpload.slice(i, i + CONCURRENCY);

    await Promise.all(batch.map(async (fname) => {
      const fpath = path.join(catalogDir, fname);
      // public_id = nome sem extensão (Cloudinary adiciona a extensão automaticamente)
      const publicId = 'catalog/' + fname.replace(/\.(jpg|jpeg|png)$/i, '');

      try {
        await cloudinary.uploader.upload(fpath, {
          public_id: publicId,
          overwrite: false,
          resource_type: 'image',
        });
        done.add(fname);
        success++;
      } catch(err) {
        // Se já existe no Cloudinary, contar como sucesso
        if (err.http_code === 400 && err.message?.includes('already exists')) {
          done.add(fname);
          success++;
        } else {
          failed++;
          failedList.push(fname);
          console.error(`  ❌ ${fname}: ${err.message}`);
        }
      }
    }));

    // Salvar progresso a cada lote
    fs.writeFileSync(progressFile, JSON.stringify([...done]));

    const total = i + batch.length;
    const pct = Math.round((total / toUpload.length) * 100);
    process.stdout.write(`\r[${total}/${toUpload.length}] ${pct}% — ✅ ${success} enviados, ❌ ${failed} falhas`);
  }

  console.log('\n\n=== RESULTADO ===');
  console.log(`✅ Enviados com sucesso: ${success}`);
  console.log(`❌ Falhas: ${failed}`);

  if (failedList.length > 0) {
    fs.writeFileSync('cloudinary_failed.txt', failedList.join('\n'));
    console.log(`Falhas salvas em cloudinary_failed.txt — rode novamente para tentar de novo.`);
  } else {
    console.log('\nTodas as imagens estão no Cloudinary! 🎉');
    console.log('Agora atualize o csv_loader.js e limpe o localStorage do browser.');
  }
}

main().catch(console.error);
