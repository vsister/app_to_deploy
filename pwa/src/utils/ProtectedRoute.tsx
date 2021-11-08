import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { RootState } from '@store/index';
import { LoadingStatus } from '@store/slices/user';
import { UserRole } from 'shared/entities/User';

const mapStateToProps = (state: RootState) => {
  const { authStatus, data, loading } = state.user;
  return {
    data,
    authStatus,
    loading,
  };
};

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface ProtectedRouteProps extends RouteProps {
  allowedUserRoles: UserRole[];
  redirectRoute: string;
  [key: string]: any;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = connector((props: ProtectedRouteProps & ReduxProps) => {
  const { authStatus, data: userData, allowedUserRoles, loading, redirectRoute, ...rest } = props;
  const { exact, path, component: Component } = rest;

  if (loading !== LoadingStatus.Complete) {
    return <h1>Загрзка...</h1>;
  }

  const isAllowed =
    userData._id && allowedUserRoles.find(userRole => userRole === userData.role) && authStatus.isAuthenticated;

  return (
    <Route
      exact={exact}
      path={path}
      render={props => (isAllowed ? <Component {...props} /> : <Redirect to={redirectRoute} />)}
    />
  );
});
