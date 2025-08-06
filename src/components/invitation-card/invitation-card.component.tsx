import './invitation-card.component.css'
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {viewInvitationCard} from "../../services/invitation-card.service";

export const InvitationCard = () => {


    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [inviteeName, setInviteeName] = useState('');
    const params = useParams<{ id: string }>();
    const { id } = params;

    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            return;
        }
        viewInvitationCard(atob(id)).then(card  => {
            if (!card){
                return;
            }
            setInviteeName(card.name);
        })
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setToastMessage("Copied: " + text);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                setToastMessage('');
            }, 3000);
        }, () => {
            alert("Oops, unable to copy");
        });
    }


    function hideToast() {
        setShowToast(false)
    }

    const navigateToPledges = () => {
        if (!id) {
            return;
        }
        navigate('/pledges/' +  id);
    }


    return <div className="card-container">
        <div className="card">
            <img src={process.env.PUBLIC_URL + '/images/11.gif'} alt="flower-top" className="flowers-top"/>
            <img src={process.env.PUBLIC_URL + '/images/12.gif'} alt="flower-bottom" className="flowers-bottom"/>

            <div className="header">Mwaliko wa Harusi</div>

            <div className="content">
                Familia ya <strong>Mr & Mrs Natalis Mataba</strong> wa Maswa Simiyu wanayo furaha
                kukutaarifu/kuwataarifu <br/>
                <div className="recipient-box" id="inviteeName">
                    {inviteeName}
                </div>
                Kuwa kijana wao mpendwa <br/>
                <span className="highlight">Victor Mataba</span><br/><br/> Anatarajia kufunga ndoa takatifu
                tarehe <strong>15/11/2025</strong> Dar es Salaam.<br/> Hivyo ukiwa ndugu jamaa na rafiki wa karibu na
                familia hii, <br/> tunaomba mchango wako wa hali
                na mali kuhakikisha shughuli hii inafanikiwa.<br/> Ili kufanikisha shughuli hii muhimu karibu kwa mchango/ahadi.
            </div>

            <div className="contacts">
                <div className="copyable" onClick={() => copyToClipboard('0657471721')}>
                    0657471721 (YAS/TIGOPESA) - VICTOR NATALIS MATABA
                </div>
                <div className="copyable" onClick={() => copyToClipboard('0762228745')}>
                    0762228745 (MPESA) - FRANK MATABA
                </div>
                <div className="copyable" onClick={() => copyToClipboard('20810055844')}>
                    20810055844 (NMB) - VICTOR NATALIS MATABA
                </div>
            </div>

            <button className="pledge-button" onClick={navigateToPledges}>
                Pledge Now
            </button>
        </div>

        {showToast && <div id="toast" onClick={hideToast}>
            <img src="/images/account-balance.svg" alt="cash"/>
            <span id="toastMessage">{toastMessage}</span>
        </div>}
    </div>

};