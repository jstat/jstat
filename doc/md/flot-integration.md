## Flot Integration

### Code Example

    var betaInst = jStat.beta( 3, 4 );
    j$.flot( '#betadiv', [{
        data : betaInst.pdf,
        label : 'PDF'
    },{
        data : betaInst.cdf,
        label : 'CDF',
        yaxis : 2
    }],{
        flotopts : {
            yaxes : [{}, { position : 'right' }]
        },
        start : 0,
        stop : 1,
        step : 1001
    });
