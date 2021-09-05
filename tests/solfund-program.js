
const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;
const web3 = require('@solana/web3.js');

let _myAccount;

describe("basic-1", () => {
  // Use a local provider.
  const provider = anchor.Provider.env();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  it("Creates and initializes an account in a single atomic transaction (simplified)", async () => {
    // #region code-simplified
    // The program to execute.
    const idl = JSON.parse(require('fs').readFileSync('/Users/shreykeny/Desktop/anchor/examples/tutorial/basic-0/target/idl/basic_0.json', 'utf8'));

    const programId = new anchor.web3.PublicKey('FtZHN4JynMytukLuUyFywAi8d1hDdxQLXjGUj5HVU1Tn');
    console.log(programId);

    // Generate the program client from IDL.
    const program = new anchor.Program(idl, programId);

    // Address of the deployed program.

    console.log(provider);


    console.log(idl);

    // The Account to create.
    const myAccount = anchor.web3.Keypair.generate();
    console.log("ma", myAccount);
    _myAccount = myAccount;

    // Create the new account and initialize it with the program.
    // #region code-simplified
    await program.rpc.initialize(new anchor.BN(1420), "hi".toString(), {
      accounts: {
        myAccount: myAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [myAccount],
    });
    // #endregion code-simplified

    // Fetch the newly created account from the cluster.
    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log("Account :", account);

    // Check it's state was initialized.
    assert.ok(account.data == "hi".toString());
    assert.ok(account.amount.eq(new anchor.BN(1420)));


    // Store the account for the next test.

  });

  it("Updates a previously created account", async () => {
    const myAccount = _myAccount;

    // #region update-test

    // The program to execute.
    const idl = JSON.parse(require('fs').readFileSync('/Users/shreykeny/Desktop/anchor/examples/tutorial/basic-0/target/idl/basic_0.json', 'utf8'));

    // Address of the deployed program.
    // const programId = new anchor.web3.PublicKey('3cJs7BaJvCmzosq4oPf9FGGraqiQto8SBDKZZ1svu88X');
    const programId = new anchor.web3.PublicKey('FtZHN4JynMytukLuUyFywAi8d1hDdxQLXjGUj5HVU1Tn');
    console.log(programId);

    // Generate the program client from IDL.
    const program = new anchor.Program(idl, programId);


    // Invoke the update rpc.
    await program.rpc.update(new anchor.BN(1142), "bye".toString(), {
      accounts: {
        myAccount: myAccount.publicKey,
      },
    });

    // Fetch the newly updated account.
    const account = await program.account.myAccount.fetch(myAccount.publicKey);

    // Check it's state was mutated.
    assert.ok(account.data == "bye".toString());
    console.log(account.amount.toNumber());
    assert.ok(account.amount.eq(new anchor.BN(1142)));


    // #endregion update-test
  });

  it("Sends SOL to PDA", async () => {
    var connection = new web3.Connection(
      web3.clusterApiUrl('devnet'),
      'confirmed',
    );

    console.log("pw", provider.wallet.payer);
    console.log("wallet", provider.wallet.publicKey);

    const myAccount = _myAccount;

    const programId = 'FtZHN4JynMytukLuUyFywAi8d1hDdxQLXjGUj5HVU1Tn';

    var transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: _myAccount.publicKey,
        lamports: web3.LAMPORTS_PER_SOL,
      }),
    );

    // Sign transaction, broadcast, and confirm
    var signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [provider.wallet.payer],
    );
    console.log('SIGNATURE', signature);


    // var from = web3.Keypair.fromSecretKey(provider.wallet.payer);

    // var airdropSignature = await connection.requestAirdrop(
    //   from.publicKey,
    //   web3.LAMPORTS_PER_SOL,
    // );
    // await connection.confirmTransaction(airdropSignature);

    // // Generate a new random public key
    // var to = web3.Keypair.generate();

    // // Add transfer instruction to transaction
    // var transaction = new web3.Transaction().add(
    //   web3.SystemProgram.transfer({
    //     fromPubkey: from.publicKey,
    //     toPubkey: to.publicKey,
    //     lamports: web3.LAMPORTS_PER_SOL / 100,
    //   }),
    // );

    // // Sign transaction, broadcast, and confirm
    // var signature = await web3.sendAndConfirmTransaction(
    //   connection,
    //   transaction,
    //   [from],
    // );
    // console.log('SIGNATURE', signature);
  });

  it("Transfer", async () => {
    const myAccount = _myAccount;

    // #region update-test
    const finalWallet = anchor.web3.Keypair.generate();

    // The program to execute.
    const idl = JSON.parse(require('fs').readFileSync('/Users/shreykeny/Desktop/anchor/examples/tutorial/basic-0/target/idl/basic_0.json', 'utf8'));

    // Address of the deployed program.
    // const programId = new anchor.web3.PublicKey('3cJs7BaJvCmzosq4oPf9FGGraqiQto8SBDKZZ1svu88X');
    const programId = new anchor.web3.PublicKey('FtZHN4JynMytukLuUyFywAi8d1hDdxQLXjGUj5HVU1Tn');
    console.log(programId);

    // Generate the program client from IDL.
    const program = new anchor.Program(idl, programId);


    // Invoke the update rpc.
    const tx = await program.rpc.transfer(new anchor.BN(1142), "bye".toString(), {
      accounts: {
        myAccount: myAccount.publicKey,
        walletAddress: finalWallet.publicKey,
      },
    });

    console.log("Tx", tx);
  });

});