import React from 'react'
import { PayPalScriptProvider,usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useLoading } from '../../hooks/useLoading';
import { useEffect } from 'react';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';


export default function PaypalButtons({order}) {
  return  (
    <PayPalScriptProvider
      options={{
        clientId:
          'AbISlKjiPXfBUX1UmpPSrh8dI7JP-sLUpmGnUpqpf_c5OQPLgLcqA22MNjCBLI0TKUFnwRnxGhXfr1oN'
      }}
    >
      <Buttons order={order} />
    </PayPalScriptProvider>
  );
    
  
}

function Buttons({ order }) {
   const {clearCart}  = useCart();
   const navigate = useNavigate();
    const [{ isPending }] = usePayPalScriptReducer();
    const { showLoading, hideLoading } = useLoading();
    useEffect(() => {
      isPending ? showLoading() : hideLoading();
    });

    const createOrder = (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: 'INR',
                value: order.totalPrice,
              },
            },
          ],
        });
      };

      const onApprove = async (data, actions) => {
        try {
          const payment = await actions.order.capture();
          const orderId = await pay(payment.id);
          clearCart();
          toast.success('Payment Saved Successfully', 'Success');
          navigate('/track/' + orderId);
         
        } catch (error) {
            toast.error('Payment Save Failed', 'Error');
        }
      };

      const onError = err => {
        toast.error('Payment Failed', 'Error');
      };
      return (
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        />
      );
}
