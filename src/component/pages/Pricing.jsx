import React from 'react';
import PageContent from '../docs/PageContent';

const Pricing = () => {
    return (
        <PageContent title='Pricing'>
            <p>
                <strong>
                    IrysUp is completely free to use.
                </strong>
                We do not charge any subscription fees,
                transaction fees, or platform commissions for uploading, downloading, editing, or storing content.
            </p>
            <p>
                The only costs you may encounter are network gas fees required by the Irys DataChain to anchor your files on-chain.
                These fees are paid directly to the blockchain network—not to IrysUp—and are determined by the Irys protocol’s current operational rates.
            </p>
            <blockquote>
                <strong>
                    Important:
                </strong>
                IrysUp acts solely as an interface to the Irys DataChain.
                We do not collect, retain, or profit from any transaction fees.
                Your payments go directly to the decentralized network that secures your data.
            </blockquote>
        </PageContent>
    );
};

export default Pricing;