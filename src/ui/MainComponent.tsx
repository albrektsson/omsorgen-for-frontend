import { Box, Margin } from '@navikt/k9-react-components';
import axios from 'axios';
import React from 'react';
import { ContainerContract } from '../types/ContainerContract';
import OmsorgsperiodeoversiktType from '../types/Omsorgsperiodeoversikt';
import OmsorgsperioderResponse from '../types/OmsorgsperioderResponse';
import { get } from '../util/httpUtils';
import ActionType from './actionTypes';
import Omsorgsperiodeoversikt from './components/omsorgsperiodeoversikt/Omsorgsperiodeoversikt';
import PageContainer from './components/page-container/PageContainer';
import ContainerContext from './context/ContainerContext';
import styles from './mainComponent.less';
import mainComponentReducer from './reducer';

interface MainComponentProps {
    data: ContainerContract;
}

const MainComponent = ({ data }: MainComponentProps) => {
    const [state, dispatch] = React.useReducer(mainComponentReducer, {
        isLoading: true,
        omsorgsperiodeoversiktHarFeilet: false,
        omsorgsperiodeoversikt: null,
    });

    const { omsorgsperiodeoversikt, isLoading, omsorgsperiodeoversiktHarFeilet } = state;

    const httpCanceler = React.useMemo(() => axios.CancelToken.source(), []);

    const getOmsorgsperioder = () =>
        get<OmsorgsperioderResponse>(data.endpoints.omsorgsperioder, data.httpErrorHandler, {
            cancelToken: httpCanceler.token,
        });

    const handleError = () => {
        dispatch({ type: ActionType.FAILED });
    };

    React.useEffect(() => {
        let isMounted = true;
        getOmsorgsperioder()
            .then((response: OmsorgsperioderResponse) => {
                if (isMounted) {
                    const nyOmsorgsperiodeoversikt = new OmsorgsperiodeoversiktType(response);
                    dispatch({ type: ActionType.OK, omsorgsperiodeoversikt: nyOmsorgsperiodeoversikt });
                }
            })
            .catch(handleError);
        return () => {
            isMounted = false;
            httpCanceler.cancel();
        };
    }, []);

    return (
        <ContainerContext.Provider value={data}>
            <h1 style={{ fontSize: 22 }}>Omsorg</h1>
            <Box marginTop={Margin.large}>
                <PageContainer isLoading={isLoading} hasError={omsorgsperiodeoversiktHarFeilet}>
                    <div className={styles.mainComponent}>
                        <Omsorgsperiodeoversikt omsorgsperiodeoversikt={omsorgsperiodeoversikt} />
                    </div>
                </PageContainer>
            </Box>
        </ContainerContext.Provider>
    );
};

export default MainComponent;
