/* eslint-disable react-hooks/exhaustive-deps */

import { useMemo } from 'react';
import './App.less';
import MainRoute from '@/router/index';
import {
  routesContext,
  useRoutesReducer,
  authContext,
  useAuthReducer,
  useMenuReducer,
  menuContext,
  useNavReducer,
  navContext,
  tagsContext,
  useTagsReducer,
  configContext,
  useConfigReducer
} from '@/context';

const App: React.FC = () => {
  const [auth, dispatchAuth] = useAuthReducer();
  const [routes, dispatch] = useRoutesReducer();
  const [menus, dispatchMenu] = useMenuReducer();
  const [headnav, dispatchNav] = useNavReducer();
  const [tags, dispatchTags] = useTagsReducer();
  const [config, dispatchConfig] = useConfigReducer();

  const a = useMemo(() => ({ auth, dispatchAuth }), [auth]);
  const b = useMemo(() => ({ routes, dispatch }), [routes]);
  const c = useMemo(() => ({ menus, dispatchMenu }), [menus]);
  const d = useMemo(() => ({ headnav, dispatchNav }), [headnav]);
  const f = useMemo(() => ({ tags, dispatchTags }), [tags]);
  const g = useMemo(() => ({ config, dispatchConfig }), [config]);

  return (
    <div className="App">
      <authContext.Provider value={a}>
        <routesContext.Provider value={b}>
          <menuContext.Provider value={c}>
            <navContext.Provider value={d}>
              <tagsContext.Provider value={f}>
                <configContext.Provider value={g}>
                  <MainRoute />
                </configContext.Provider>
              </tagsContext.Provider>
            </navContext.Provider>
          </menuContext.Provider>
        </routesContext.Provider>
      </authContext.Provider>
    </div>
  );
}

export default App;
