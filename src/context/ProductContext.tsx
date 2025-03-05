import { createContext, ReactNode, useContext, useReducer } from 'react';
import { Product } from '../types/types';

// An action is an instruction to change the state
type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string };

// Define the shape of the state
interface ProductState {
  products: Product[];
  selectedCategory: string;
}

// const [name, setName] = useState('')

// Initial state
const initialState: ProductState = {
  products: [],
  selectedCategory: '',
};

// Reducer function listens for actions and changes the state based on the action type and returns the updated state
const productReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Create context
interface ProductContextType extends ProductState {
  dispatch: React.Dispatch<ProductAction>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
interface ProductProviderProps {
  children: ReactNode
}

// The ProductProvider component is responsible for providing the state and dispatch function to the rest of the app
export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  // useReducer is used to manage the state using the reducer function and the initial state. This hook returns the current state and a dispatch function
  const [state, dispatch] = useReducer(productReducer, initialState);
  // const [name, setName] = useState('')

  // The dispatch function allows us to trigger actions like 'SET_PRODUCTS' or 'SET_SELECTED_CATEGORY' to update the state

  return (
    <ProductContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for accessing the context
export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
