# Simplest Rust program I could make

## Run

Edit the variables in `src/lib.rs` as the comments tell you, then:

In one terminal:

```bash
cargo build-bpf
solana program deploy target/deploy/scratch.so
```

Take note of the deployed program ID and then:

```bash
solana logs <that ID>
```

In another terminal:

```bash
cd cli
yarn install
# Make sure that the solana logs command is still
# running before you run the next line
npx ts-node index.ts
```

Then check the logs terminal and be happy.

## How I created this from scratch

I built this by doing:

```cargo new --lib scratch```

Added this to `Cargo.toml`:

```TOML
[dependencies]
solana-program = "1.9.6" # use latest

[lib]
crate-type = ["cdylib", "lib"]
```

Edited `lib.rs` to be a program that prints the 3 arguments on the entrypoint:

```rust
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    
    msg!(
        "process_instruction: {}: {} accounts, data={:?}",
        program_id,
        accounts.len(),
        instruction_data
    );

    Ok(())
}

```

Created a CLI with:

```bash
mkdir cli
cd cli
yarn init
yarn add --dev typescript @types/node @solana/web3.js
touch index.ts
```

Edited `package.json` main to `index.ts` instead of `index.js`, and added this to `index.ts`:

```typescript
import web3 = require("@solana/web3.js");

const SECRET = []; 		// cat ~/.config/solana/id.json
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
			data: Buffer.from([14, 27, 49]) // random numbers
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
```
