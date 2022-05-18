import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  TransactionInstruction } from '@solana/web3.js';
import { deserialize, serialize } from "borsh";

import { programId,  CampaignDetails} from '../../solana';

const CreatForm = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [formData, setFormData] = useState({});

  const onInputChange = (e) => {
    let newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    }

    setFormData(newFormData)
  }

  const onCreatClick = async() => {
    const SEED = "abcdef" + Math.random().toString();
    let newAccount = await PublicKey.createWithSeed(
        publicKey,
        SEED,
        programId
    );
    
    let campaign = new CampaignDetails({
      name: formData.name,
      description: formData.desc,
      image_link: formData.img,
      admin: publicKey.toBuffer(),
      amount_donated: 0
    })

    let data = serialize(CampaignDetails.schema, campaign);
    let data_to_send = new Uint8Array([0, ...data]);

    const lamports =
      (await connection.getMinimumBalanceForRentExemption(data.length));
    
    const createProgramAccount = SystemProgram.createAccountWithSeed({
      fromPubkey: publicKey,
      basePubkey: publicKey,
      seed: SEED,
      newAccountPubkey: newAccount,
      lamports: lamports,
      space: data.length,
      programId: programId,
    });

    const instructionTOOurProgram = new TransactionInstruction({
      keys: [
          { pubkey: newAccount, isSigner: false, isWritable: true },
          { pubkey: publicKey, isSigner: true, }
      ],
      programId: programId,
      data: data_to_send,
    });

    const transaction = new Transaction().add(
      createProgramAccount
    );
    transaction.add(instructionTOOurProgram)

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signature, 'processed');
  }

  return (
    <>
      <h3>New Project</h3>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input type="text" className="form-control" name="name" value={formData.name} onChange={onInputChange}/>
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <input type="text" className="form-control" name="desc" value={formData.desc} onChange={onInputChange}/>
      </div>
      <div className="mb-3">
        <label className="form-label">Image</label>
        <input type="text" className="form-control" name="img" value={formData.img} onChange={onInputChange}/>
      </div>
      <button className="btn btn-primary" onClick={onCreatClick}>Creat</button>
    </>
  )
}

export default CreatForm;