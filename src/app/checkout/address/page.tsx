import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import StepProgressBar from '@/components/stepprogessbar';


interface Country {
  code: string;
  country: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  type: string;
}

interface ShippingZone {
  id: string;
  name: string;
  countries: Country[];
  shippingMethods: ShippingMethod[];
}

interface ShippingZonesResponse {
  data: {
    shippingZones: {
      edges: {
        node: ShippingZone;
      }[];
    };
  };
}

interface ShippingAddressInput {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  city: string;
  countryArea: string;
  postalCode: string;
  country: string;
}

const ShippingAddressForm: React.FC = () => {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [availableMethods, setAvailableMethods] = useState<ShippingMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState<ShippingAddressInput>({
    firstName: '',
    lastName: '',
    streetAddress1: '',
    city: '',
    countryArea: '',
    postalCode: '',
    country: '',
  });

  const GRAPHQL_ENDPOINT = 'https://saleor-kombee.onrender.com/graphql/';
  const CHECKOUT_ID = () => localStorage.getItem('CheckOutID');


  useEffect(() => {
    const fetchZones = async () => {
      const query = `
        query GetShippingZones {
          shippingZones(first: 10) {
            edges {
              node {
                id
                name
                countries {
                  code
                  country
                }
                shippingMethods {
                  id
                  name
                  type
                }
              }
            }
          }
        }
      `;

      try {
        const response = await axios.post<ShippingZonesResponse>(
          GRAPHQL_ENDPOINT,
          { query },
          { headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + localStorage.getItem('authToken') } }
        );

        const zones = response.data.data.shippingZones.edges.map(edge => edge.node);
        setZones(zones);
      } catch (err) {
        console.error('Error fetching zones:', err);
      }
    };

    fetchZones();
  }, []);


  useEffect(() => {
    if (!selectedCountryCode) {
      setAvailableMethods([]);
      return;
    }

    const zone = zones.find(z => z.countries.some(c => c.code === selectedCountryCode));
    setAvailableMethods(zone?.shippingMethods || []);
    setSelectedMethodId('');
    setFormData(prev => ({ ...prev, country: selectedCountryCode }));
  }, [selectedCountryCode, zones]);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      setSelectedCountryCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const mutation = `
      mutation SetShippingAndBillingAddress($checkoutId: ID!, $shippingAddress: AddressInput!, $billingAddress: AddressInput!) {
        checkoutShippingAddressUpdate(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
          checkout {
            id
            shippingAddress {
              id
              firstName
              lastName
              streetAddress1
              city
              countryArea
              postalCode
              country {
                code
              }
            }
          }
          errors {
            field
            message
          }
        }
        checkoutBillingAddressUpdate(checkoutId: $checkoutId, billingAddress: $billingAddress) {
          checkout {
            id
            billingAddress {
              id
              firstName
              lastName
              streetAddress1
              city
              countryArea
              postalCode
              country {
                code
              }
            }
          }
          errors {
            field
            message
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: mutation,
          variables: {
            checkoutId: CHECKOUT_ID(),
            shippingAddress: formData,
            billingAddress: formData,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const errors = response.data.data.checkoutShippingAddressUpdate.errors.concat(response.data.data.checkoutBillingAddressUpdate.errors);
      if (errors.length > 0) {
        setMessage(errors.map((e: any) => e.message).join(', '));
      } else {
        router.push('/checkout/payment-details');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StepProgressBar></StepProgressBar>

      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Shipping and Billing Address Form</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['firstName', 'lastName', 'streetAddress1', 'city', 'countryArea', 'postalCode'].map((field) => (
            <input
              key={field}
              name={field}
              type="text"
              placeholder={field}
              value={(formData as any)[field]}
              onChange={handleInputChange}
              required
              className="w-full border rounded p-2"
            />
          ))}

          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select Country</option>
            {Array.from(
              new Map(
                zones.flatMap(z => z.countries).map(c => [c.code, c])
              ).values()
            ).map(c => (
              <option key={c.code} value={c.code}>
                {c.country}
              </option>
            ))}
          </select>

          {availableMethods.length > 0 && (
            <select
              value={selectedMethodId}
              onChange={(e) => setSelectedMethodId(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select Shipping Method</option>
              {availableMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name} ({method.type})
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 w-full rounded hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing... Please wait' : 'Submit'}
          </button>

          {message && <p className="text-sm mt-2 text-red-500">{message}</p>}
        </form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
