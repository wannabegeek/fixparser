import { FixParser } from '../lib/FixParser';
import { FixContext, RepeatingGroupContext, FIXRepeatingGroupContainer } from '../lib/FixContext';
import { FIX44Dictionary } from '../lib/Fix44Dictionary'

describe('add', () => {

    // let testMessage = "8=FIX.4.4^A9=1327^A35=8^A34=883^A49=FID_UAB_LON_OES^A56=BARC_UAB_LON_OES^A43=N^A52=20170925-09:11:14.123^A200=201803^A231=100.000000000000^A8158=C^A1724=0^A1=QAAgency^A6=0.000000000000^A11=00000041747ORLO1.1^A14=0^A15=EUR^A17=20170925101114073322^A20=0^A22=8^A30=XEUE^A31=0.00^A32=0^A37=00000041747ORLO1^A38=10^A39=0^A40=2^A44=99.000000000000^A528=A^A48=AE6^A54=2^A55=AE6^A59=0^A60=20170925-09:11:14.033^A64=20170928^A63=6^A99=0.000000^A109=QAClient^A126=20170925-21:59:00.000^A119=0.000000^A120=EUR^A150=0^A151=10.000000^A167=FUT^A207=XEUE^A454=4^A455=NLENX0542490^A456=4^A455=AE6=H8 Equity^A456=A^A455=AE6_FH8^A456=8^A455=AE6_FH8.LA^A456=M^A6442=0.000000^A8001=ORDER_NEW^A8002=20170925 10:11:14.033322 +0100s^A8004=1^A8016=FTW^A8031=ELA-FU^A8033=N^A8040=0^A8041=EMMAES^A8056=0^A8062=sarvakam^A8065=0^A8066=0^A8075=C^A8076=00000041747ORLO1^A8094=C^A8100=NLENX0542490^A8102=4^A8142=OMAR^A8143=OMAR^A442=1^A461=FFSCSX^A541=20180316^A107=Aegon NV Mar18^A453=7^A448=sarvakam^A447=D^A452=11^A802=3^A523=sarvakam^A803=2^A523=BarCapFutures.FETServAP^A803=24^A523=SG^A803=25^A448=QAClient^A447=D^A452=3^A802=1^A523=1234561^A803=3^A448=QAAgency^A447=D^A452=24^A802=5^A523=QACLIENTAGENCY^A803=19^A523=12345643^A803=3^A523=123Client^A803=100^A523=123Client^A803=28^A523=A^A803=26^A448=BPLC^A447=D^A452=7^A448=sarvakam^A447=D^A452=39^A448=13571113^A447=P^A452=3^A448=2000581^A447=P^A452=12^A711=1^A309=AGN.AM^A305=K^A30112=00000041747ORLO1.1^A30113=BPLC^A30110=LIM^A30019=G45824133^A10=121^A";
    let testMessage = "8=FIX.4.4^A9=1327^A35=8^A34=883^A49=FID_UAB_LON_OES^A56=BARC_UAB_LON_OES^A43=N^A52=20170925-09:11:14.123^A453=7^A448=sarvakam^A447=D^A452=11^A802=3^A523=sarvakam^A803=2^A523=BarCapFutures.FETServAP^A803=24^A523=SG^A803=25^A448=QAClient^A447=D^A452=3^A802=1^A523=1234561^A803=3^A448=QAAgency^A447=D^A452=24^A802=5^A523=QACLIENTAGENCY^A803=19^A523=12345643^A803=3^A523=123Client^A803=100^A523=123Client^A803=28^A523=A^A803=26^A448=BPLC^A447=D^A452=7^A448=sarvakam^A447=D^A452=39^A448=13571113^A447=P^A452=3^A448=2000581^A447=P^A452=12^A10=121^A";

    let dictionary = FIX44Dictionary;

    it('should sum given numbers', () => {
        let ctx = FixParser.parse(testMessage, dictionary);
        console.log(logger(ctx, 0));
    });
});

function logger(ctx: FixContext, indent: number): string {
    let output = "";
    let first = true;
    ctx.getTags((tag, value) => {
        output += "   ".repeat(indent) + (first ? "- " : "  ") + tag.toString() + " => ";
        first = false;
        if (FixContext.isRepeatingGroup(value)) {
            let container = value as FIXRepeatingGroupContainer;
            output += "[" + container.groupCount() + "] {\n"
            for (let group of container.contexts()) {
                output += logger(group, indent + 1);
            }
            output += "   ".repeat(indent) + "  }";
        } else {
            output += value;
        }
        output += "\n";
    });

    return output;
}