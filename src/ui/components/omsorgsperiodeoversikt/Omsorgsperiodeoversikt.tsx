import React, { useEffect } from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import OmsorgsperiodeoversiktType from '../../../types/Omsorgsperiodeoversikt';
import Omsorgsperiode from '../../../types/Omsorgsperiode';
import OmsorgsperiodeoversiktMessages from '../omsorgsperiodeoversikt-messages/OmsorgsperiodeoversiktMessages';
import Periodenavigasjon from '../periodenavigasjon/Periodenavigasjon';
import OmsorgsperiodeVurderingsdetaljer from '../omsorgsperiode-vurderingsdetaljer/OmsorgsperiodeVurderingsdetaljer';
import VurderingAvOmsorgsperioderForm from '../vurdering-av-omsorgsperioder-form/VurderingAvOmsorgsperioderForm';

interface OmsorgsperiodeoversiktProps {
    omsorgsperiodeoversikt: OmsorgsperiodeoversiktType;
}

const Omsorgsperiodeoversikt = ({ omsorgsperiodeoversikt }: OmsorgsperiodeoversiktProps): JSX.Element => {
    const [valgtPeriode, setValgtPeriode] = React.useState<Omsorgsperiode>(null);
    const [erRedigeringsmodus, setErRedigeringsmodus] = React.useState(false);

    const perioderTilVurdering = omsorgsperiodeoversikt.finnPerioderTilVurdering();
    const vurderteOmsorgsperioder = omsorgsperiodeoversikt.finnVurdertePerioder();

    const velgPeriode = (periode: Omsorgsperiode) => {
        setValgtPeriode(periode);
        setErRedigeringsmodus(false);
    };

    useEffect(() => {
        if (omsorgsperiodeoversikt.harPerioderTilVurdering()) {
            setValgtPeriode(perioderTilVurdering[0]);
        }
    }, []);

    return (
        <>
            <OmsorgsperiodeoversiktMessages omsorgsperiodeoversikt={omsorgsperiodeoversikt} />
            <NavigationWithDetailView
                navigationSection={() => (
                    <Periodenavigasjon
                        perioderTilVurdering={perioderTilVurdering}
                        vurdertePerioder={vurderteOmsorgsperioder}
                        onPeriodeValgt={velgPeriode}
                        harValgtPeriode={valgtPeriode !== null}
                    />
                )}
                showDetailSection={!!valgtPeriode}
                detailSection={() => {
                    if (perioderTilVurdering.includes(valgtPeriode) || erRedigeringsmodus) {
                        return (
                            <VurderingAvOmsorgsperioderForm
                                omsorgsperiode={valgtPeriode}
                                onAvbryt={() => velgPeriode(null)}
                            />
                        );
                    }
                    return (
                        <OmsorgsperiodeVurderingsdetaljer
                            omsorgsperiode={valgtPeriode}
                            onEditClick={() => setErRedigeringsmodus(true)}
                            registrertForeldrerelasjon={omsorgsperiodeoversikt.registrertForeldrerelasjon}
                        />
                    );
                }}
            />
        </>
    );
};

export default Omsorgsperiodeoversikt;
