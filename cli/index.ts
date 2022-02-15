import web3 = require("@solana/web3.js");

const SECRET = []; 		// cat ~/.config/solana/id.json (not safe don't share the key)
const PROGRAMID = ""; 	// whatever you get after `solana program deploy target/deploy/scratch.so`

const conn = new web3.Connection(web3.clusterApiUrl("devnet"));
const key: Uint8Array = Uint8Array.from(SECRET);
const programId = new web3.PublicKey(PROGRAMID);

async function main() {
	const signer: web3.Keypair = web3.Keypair.fromSecretKey(key);

	const transaction: web3.Transaction = new web3.Transaction().add(
		new web3.TransactionInstruction({
			keys: [],
			programId,
			data: Buffer.from([14, 27, 49])
		})
	);

	await web3.sendAndConfirmTransaction(conn, transaction, [signer]);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
