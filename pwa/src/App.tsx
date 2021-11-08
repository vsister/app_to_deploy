import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ProtectedRoute } from '@utils/ProtectedRoute';
import { verifyToken } from '@store/thunks/user';
import { AuthPage } from './pages/Auth/AuthPage';
import { UserRole } from 'shared/entities/User';
import { CataloguePage } from './pages/Catalogue/CataloguePage';
import { SubcataloguePage } from './pages/Subcatalogue/SubcataloguePage';
import { CategoryPage } from './pages/Category/CategoryPage';
import { ProductPage } from './pages/Product/ProductPage';
import { SearchPage } from './pages/Search/SearchPage';
import { CartPage } from './pages/Cart/CartPage';
import { CreateUserPage } from './pages/CreateUser/CreateUserPage';
import { EditUserPage } from './pages/EditUser/EditUserPage';
import { CreateGroupPage } from './pages/CreateGroup/CreateGroupPage';
import { EditGroupPage } from './pages/EditGroup/EditGroupPage';
import { CreateCategoryPage } from './pages/CreateCategory/CreateCategoryPage';
import { EditCategoryPage } from './pages/EditCategory/EditCategoryPage';
import { CreateSubcategoryPage } from './pages/CreateSubcategory/CreateSubcategoryPage';
import { EditSubcategoryPage } from './pages/EditSubcategory/EditSubcategoryPage';
import { CreateProductPage } from './pages/CreateProductPage/CreateProductPage';
import { EditProductPage } from './pages/EditProductPage/EditProductPage';
import { ProfilePage } from './pages/Profile/ProfilePage';

export const App: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(verifyToken());
  }, []);

  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin, UserRole.Editor, UserRole.Expert, UserRole.Purchaser]}
        component={CataloguePage}
      />
      <ProtectedRoute
        exact
        path="/user"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin, UserRole.Editor, UserRole.Expert, UserRole.Purchaser]}
        component={ProfilePage}
      />
      <ProtectedRoute
        exact
        path="/category/:categoryId"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin, UserRole.Editor, UserRole.Expert, UserRole.Purchaser]}
        component={SubcataloguePage}
      />
      <ProtectedRoute
        exact
        path="/category/:categoryId/subcategory/:subcategoryId"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin, UserRole.Editor, UserRole.Expert, UserRole.Purchaser]}
        component={CategoryPage}
      />
      <ProtectedRoute
        exact
        path="/category/:categoryId/subcategory/:subcategoryId/product/create"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Editor, UserRole.Purchaser, UserRole.Expert, UserRole.Admin]}
        component={CreateProductPage}
      />
      <ProtectedRoute
        exact
        path="/category/:categoryId/subcategory/:subcategoryId/product/:productId"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin, UserRole.Editor, UserRole.Expert, UserRole.Purchaser]}
        component={ProductPage}
      />
      <ProtectedRoute
        exact
        path="/category/:categoryId/subcategory/:subcategoryId/product/:productId/edit"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin, UserRole.Editor, UserRole.Expert, UserRole.Purchaser]}
        component={EditProductPage}
      />
      <ProtectedRoute
        exact
        path="/search/:query"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin, UserRole.Editor, UserRole.Expert, UserRole.Purchaser]}
        component={SearchPage}
      />
      <ProtectedRoute
        exact
        path="/cart"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin, UserRole.Editor, UserRole.Expert, UserRole.Purchaser]}
        component={CartPage}
      />
      <ProtectedRoute
        exact
        path="/user/create"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin]}
        component={CreateUserPage}
      />
      <ProtectedRoute
        exact
        path="/user/:userId/edit"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Admin]}
        component={EditUserPage}
      />
      <ProtectedRoute
        exact
        path="/group/create"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Editor]}
        component={CreateGroupPage}
      />
      <ProtectedRoute
        exact
        path="/group/:categoryId/edit"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Editor]}
        component={EditGroupPage}
      />
      <ProtectedRoute
        exact
        path="/group/:categoryId/category/create"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Editor]}
        component={CreateCategoryPage}
      />
      <ProtectedRoute
        exact
        path="/group/:groupId/category/:categoryId/edit"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Editor]}
        component={EditCategoryPage}
      />
      <ProtectedRoute
        exact
        path="/group/:groupId/category/:categoryId/subcategory/create"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Editor]}
        component={CreateSubcategoryPage}
      />
      <ProtectedRoute
        exact
        path="/group/:groupId/category/:categoryId/subcategory/:subcategoryId/edit"
        redirectRoute="/auth"
        allowedUserRoles={[UserRole.Editor]}
        component={EditSubcategoryPage}
      />
      <Route exact path="/auth" component={AuthPage} />
    </Switch>
  );
};
